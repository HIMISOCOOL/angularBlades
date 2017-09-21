import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LeftsidebarComponent } from './leftsidebar/leftsidebar.component';
import { InfoComponent } from './leftsidebar/info/info.component';
import { BladeModule } from './blades/blade.module';
import { PropertiesComponent } from './sidebar/properties/properties.component';
import { EditPropertyComponent } from './sidebar/properties/edit-property/edit-property.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        LeftsidebarComponent,
        InfoComponent,
        PropertiesComponent,
        EditPropertyComponent
    ],
    imports: [
        BrowserModule,
        BladeModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [
        InfoComponent,
        PropertiesComponent,
        EditPropertyComponent
    ]
})
export class AppModule { }
