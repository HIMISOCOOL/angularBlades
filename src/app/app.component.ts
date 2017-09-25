import { Component } from '@angular/core';
import { BladeService } from 'app/blades';
import { InfoInputs } from './child-module/info/info.component';
import { PropertiesInputs } from './child-module/properties/properties.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';
    constructor(
        private bladeService: BladeService
    ) { }

    public openInfoBlade(e) {
        this.bladeService.navigateTo(new InfoInputs());
    }

    public openPropertiesBlade(e) {
        this.bladeService.navigateTo(new PropertiesInputs(['Hello', 'World']));
    }
}
