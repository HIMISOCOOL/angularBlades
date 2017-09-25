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
export class LeftsidebarComponent extends BladeHost {
    direction = left;
    @ViewChildren(BladeHostDirective) bladeHosts: QueryList<BladeHostDirective>;
    constructor(
        bladeService: BladeService,
        componentFactoryResolver: ComponentFactoryResolver,
        cdRef: ChangeDetectorRef
    ) {
        super(componentFactoryResolver, cdRef, bladeService);
    }
}
