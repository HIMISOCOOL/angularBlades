import { Component, OnInit, Type, ChangeDetectorRef } from '@angular/core';
import { Blade, BladeInputs, right } from 'app/blades';
import { Option } from 'ts-option';
import { Result } from 'app/util/result';

async function onClose(inputs: EditPropertyInputs) {
    return await inputs.checkCanClose()
        ? Result.ok()
        : Result.err('Not Saved');
}

export class EditPropertyInputs extends BladeInputs {
    title = 'Edit Property';
    parent: Option<Blade>;
    direction: boolean = right;
    type: Type<EditPropertyComponent> = EditPropertyComponent;
    isSaved: boolean;
    onClose = () => this.checkCanClose()
        .then(canClose => canClose
            ? Result.ok()
            : Result.err('Not Saved'))
    checkCanClose = () => Promise.resolve(this.isSaved);
    constructor(parent: Option<Blade>) {
        super();
        this.parent = parent;
    }
}

@Component({
    selector: 'app-edit-property',
    templateUrl: './edit-property.component.html',
    styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit, Blade {
    title: string;
    parent: Option<Blade>;
    direction: boolean;
    type: Type<Blade>;
    onClose: () => Promise<Result>;
    checkCanClose: () => Promise<boolean>;

    constructor(
        public readonly cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
    }

}
