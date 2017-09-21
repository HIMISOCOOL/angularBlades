import {
    Component,
    OnInit,
    ViewChildren,
    QueryList,
    ComponentFactoryResolver,
    OnDestroy,
    AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { BladeService, BladeHostDirective, right, BladeHost, Blade, BladeInputs } from 'app/blades';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BladeHost {
    direction = right;
    @ViewChildren(BladeHostDirective) bladeHosts: QueryList<BladeHostDirective>;
    constructor(
        bladeService: BladeService,
        componentFactoryResolver: ComponentFactoryResolver,
        cdRef: ChangeDetectorRef
    ) {
        super(componentFactoryResolver, cdRef, bladeService);
    }

}
