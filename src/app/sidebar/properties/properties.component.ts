import { Component, OnInit, Type, Input, ChangeDetectorRef } from '@angular/core';
import { Option, none, some } from 'ts-option';
import { BladeInputs, Blade, right, BladeService } from 'app/blades';
import { Result } from 'app/util/result';
import { EditPropertyInputs } from './edit-property/edit-property.component';

export class PropertiesInputs extends BladeInputs {
    title = 'Properties';
    parent: Option<Blade> = none;
    direction: boolean = right;
    type: Type<PropertiesComponent> = PropertiesComponent;
    onClose = () => this.checkCanClose()
        .then(canClose => canClose
            ? Result.ok()
            : Result.err('Not Saved'))
    checkCanClose = () => Promise.resolve(true);

    constructor(
        public readonly properties: string[]
    ) {
        super();
    }
}

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit, Blade {
    title: string;
    parent: Option<Blade>;
    direction: boolean;
    type: Type<PropertiesComponent>;
    @Input() properties: string[];
    onClose: () => Promise<Result>;
    checkCanClose: () => Promise<boolean>;
    constructor(
        public readonly cdRef: ChangeDetectorRef,
        public readonly bladeService: BladeService
    ) { }

    ngOnInit() {
    }

    public openChildBlade() {
        this.bladeService.navigateTo(new EditPropertyInputs(some(this)));
        const thisIndex = this.bladeService.blades.findIndex(b => b.title === this.title);
        const checkCanClose = function (bladeService: BladeService) {
            return async function () {
                console.log('From open child blade');
                const lastIndex = bladeService.blades.length - 1;
                return thisIndex < lastIndex
                    ? await bladeService.blades[lastIndex].checkCanClose()
                    : true;
            };
        };
        this.checkCanClose = checkCanClose(this.bladeService);
        this.bladeService.blades[thisIndex].checkCanClose = this.checkCanClose;
    }

}
