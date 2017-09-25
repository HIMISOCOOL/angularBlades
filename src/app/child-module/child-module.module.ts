import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { PropertiesComponent } from './properties/properties.component';
import { EditPropertyComponent } from './properties/edit-property/edit-property.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InfoComponent,
        PropertiesComponent,
        EditPropertyComponent
    ],
    entryComponents: [
        InfoComponent,
        PropertiesComponent,
        EditPropertyComponent
    ]
})
export class ChildModuleModule { }
