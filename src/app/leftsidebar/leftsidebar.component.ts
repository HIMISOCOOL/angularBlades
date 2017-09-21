import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    QueryList,
    ViewChildren,
    OnDestroy,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { BladeService, BladeHost, BladeHostDirective, left, BladeInputs } from 'app/blades';

@Component({
    selector: 'app-leftsidebar',
    templateUrl: './leftsidebar.component.html',
    styleUrls: ['./leftsidebar.component.scss']
})
export class LeftsidebarComponent extends BladeHost implements OnInit, AfterViewInit, OnDestroy {
    blades: BladeInputs[];
    direction = left;
    bladeSub: Subscription;
    @ViewChildren(BladeHostDirective) bladeHosts: QueryList<BladeHostDirective>;
    constructor(
        private bladeService: BladeService,
        componentFactoryResolver: ComponentFactoryResolver,
        cdRef: ChangeDetectorRef
    ) {
        super(componentFactoryResolver, cdRef);
    }

    ngOnInit() {
        this.setBlades(this.bladeService.blades);
        this.bladeSub = this.bladeService.blade$
            .subscribe(blade => this.setBlades(this.bladeService.blades));
    }

    ngAfterViewInit(): void {
        this.previousLength = this.bladeHosts.length;
        this.bladeHosts.changes.subscribe((bladeHosts: QueryList<BladeHostDirective>) => {
            if (this.previousLength < bladeHosts.length) {
                BladeService.createBlade(
                    this.componentFactoryResolver,
                    bladeHosts.last.viewContainerRef,
                    this.blades[this.bladeHosts.length - 1]);
                this.previousLength = this.bladeHosts.length;
                // this.cdRef.detectChanges();
            }
        });
    }

    ngOnDestroy() {
        this.bladeSub.unsubscribe();
    }

    public async closeBlade(index: number) {
        const result = await this.bladeService.tryCloseBlade(index);
    }

}
