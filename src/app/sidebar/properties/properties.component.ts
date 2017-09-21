import { Component, OnInit, Type, Input, ChangeDetectorRef } from '@angular/core';
import { Option, none } from 'ts-option';
import { BladeInputs, Blade, right } from 'app/blades';
import { Result } from 'app/util/result';

export class PropertiesInputs extends BladeInputs {
    title = 'Properties';
    parent: Option<Blade> = none;
    direction: boolean = right;
    type: Type<PropertiesComponent> = PropertiesComponent;
    onClose = () => Result.ok();
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
    onClose: () => Result;
    checkCanClose: () => Promise<boolean>;
    constructor(
        public readonly cdRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
    }

}
