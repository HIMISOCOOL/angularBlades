import { BladeHostDirective } from '../directives/blade-host.directive';
import { QueryList, ComponentFactoryResolver, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Direction } from './blade';
import { Subscription } from 'rxjs/Rx';
import { Option } from 'ts-option';
import { BladeInputs } from './blade-inputs';
import { BladeService } from '../blade.service';
export abstract class BladeHost implements OnInit, AfterViewInit, OnDestroy {
    protected previousLength: number;
    /**
     * The blades to show in this container
     */
    public blades: BladeInputs[];
    /**
     * The Direction of blades to accept
     */
    abstract direction: Direction;
    /**
     * The subscription from the blade service.
     * Remember to destroy the sub on ngOnDestroy()
     */
    private bladeSub: Subscription;
    /**
     * The elements to host blades in from the html of this component.
     * NOTE: Should be decorated with @ViewChildren(BladeHostDirective)
     */
    abstract bladeHosts: QueryList<BladeHostDirective>;
    protected bladeIsSameDirection = (blade: BladeInputs) => blade.direction === this.direction;
    protected setBlades(blades: BladeInputs[]) {
        this.blades = blades.filter(this.bladeIsSameDirection);
    }
    constructor(
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected cdRef: ChangeDetectorRef,
        protected bladeService: BladeService
    ) { }
    ngOnDestroy(): void {
        this.bladeSub.unsubscribe();
    }
    ngAfterViewInit(): void {
        this.previousLength = this.bladeHosts.length;
        this.bladeHosts.changes.subscribe((bladeHosts: QueryList<BladeHostDirective>) => {
            if (this.previousLength <= bladeHosts.length) {
                BladeService.createBlade(
                    this.componentFactoryResolver,
                    bladeHosts.last.viewContainerRef,
                    this.blades[this.bladeHosts.length - 1]);
            }
            this.previousLength = this.bladeHosts.length;
        });
    }
    ngOnInit(): void {
        this.setBlades(this.bladeService.blades);
        this.bladeSub = this.bladeService.blade$
            .subscribe(blade => this.setBlades(this.bladeService.blades));
    }

    public async closeBlade(index: number) {
        const result = await this.bladeService.tryCloseBlade(index);
        if (result.isSuccess) {
            // if index is less than lastIndex, run funciton for each until this index;
            const bladeHosts = this.bladeHosts.toArray()
                .filter((value, i) => i >= index);

            bladeHosts.forEach(bh => bh.viewContainerRef.remove());
        }
    }
}
