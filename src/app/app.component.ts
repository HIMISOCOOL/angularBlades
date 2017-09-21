import { Component } from '@angular/core';
import { BladeService } from 'app/blades';
import { InfoInputs } from './leftsidebar/info/info.component';
import { PropertiesInputs } from './sidebar/properties/properties.component';

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
