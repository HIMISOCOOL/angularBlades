import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BladeModule } from './blades/blade.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { ChildModuleModule } from './child-module/child-module.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SidebarModule,
        ChildModuleModule,
        BladeModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
