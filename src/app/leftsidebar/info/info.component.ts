import { Component, OnInit, Type, ChangeDetectorRef } from '@angular/core';
import { Blade, BladeInputs, left } from 'app/blades';
import { Option, none } from 'ts-option';
import { Result } from 'app/util/result';

export class InfoInputs extends BladeInputs {
    title = 'Information';
    parent: Option<Blade> = none;
    direction: boolean = left;
    type: Type<InfoComponent> = InfoComponent;
    onClose = () => this.checkCanClose()
        .then(canClose => canClose
            ? Result.ok()
            : Result.err('Not Saved'))
    checkCanClose = () => Promise.resolve(true);

}

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, Blade {
    type: Type<InfoComponent> = InfoComponent;
    direction: boolean = left;
    title = 'Information';
    parent: Option<Blade> = none;
    onClose: () => Promise<Result>;
    checkCanClose: () => Promise<boolean>;

    constructor(
        public readonly cdRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
    }

}
