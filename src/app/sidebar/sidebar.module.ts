import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftsidebarComponent } from './left-sidebar/leftsidebar.component';
import { SidebarComponent } from './right-sidebar/sidebar.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LeftsidebarComponent,
        SidebarComponent
    ],
    exports: [
        LeftsidebarComponent,
        SidebarComponent
    ]
})
export class SidebarModule { }
