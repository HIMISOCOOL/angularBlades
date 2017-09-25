import {
    Component,
    ViewChildren,
    QueryList,
    ComponentFactoryResolver,
    ChangeDetectorRef
} from '@angular/core';
import { BladeHost, right, BladeHostDirective, BladeService } from 'app/blades';


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
