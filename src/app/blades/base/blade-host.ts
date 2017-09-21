import { BladeHostDirective } from '../directives/blade-host.directive';
import { QueryList, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import { Direction } from './blade';
import { Subscription } from 'rxjs/Rx';
import { Option } from 'ts-option';
import { BladeInputs } from './blade-inputs';
export abstract class BladeHost {
    protected previousLength: number;
    /**
     * The blades to show in this container
     */
    abstract blades: BladeInputs[];
    /**
     * The Direction of blades to accept
     */
    abstract direction: Direction;
    /**
     * The subscription from the blade service.
     * Remember to destroy the sub on ngOnDestroy()
     */
    abstract bladeSub: Subscription;
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
        protected cdRef: ChangeDetectorRef
    ) { }
}
