Blades module
=
# Steps
1. [Install ts-option]()
2. [Import Module](#importblademodule)
3. [Make a Blade Host](#makebladehost)
    - [Make blade host component](#makecomponent)
    - [Add blade directive](#adddirective)
    - [Import BladeHost styles](#importstyles)
4. [Make a Blade](#makeblade)
    - [Copy Result class](#copyresult)
    - [Make blade component](#makebladecomponent)
    - [Make blade inputs class](#makebladeinputs)
5. [Navigate to blade](#navigate)
- Optional
    - [How to Open child blades](#openchild)
    - [How to add inputs to blades](#bladeinputs)
___
<a id="importblademodule"></a>

## Import BladeModule in app root
`app.module.ts`
```typescript
@NgModule({
    ...
    imports: [
        ...
        BladeModule.forRoot()
        ...
    ]
    ...
})
```
<a id="makebladehost"></a>

## Make a blade Host
___
<a id="makecomponent"></a>

### Make blade host component
`sidebar.component.ts`
```typescript
import {
    Component,
    ViewChildren,
    QueryList,
    ComponentFactoryResolver,
    ChangeDetectorRef
} from '@angular/core';
import { BladeHost, right, BladeHostDirective, BladeService } from 'app/blades';
@Component({
    selector:'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends BladeHost {
    direction = right;
    @ViewChildren(BladeHostDirective) bladeHosts: QueryList<BladeHostDircetive>;
    constructor(
        cfr: ComponentFactoryResolver,
        cdRef: ChangeDetectorRef,
        bladeService: BladeService
    ) {
        super(cfr, cdRef, bladeService)
    }
}
```
<a id="adddirective"></a>
`sidebar.component.html`
```html
<div class="sidebar">
    <div class="col blade" *ngFor="let blade of blades; index as i">
        <div>
            <h5>{{blade.title}}</h5>
            <button class="close-btn" (click)="closeBlade(i)">X</button>
        </div>
        <ng-template blade-host></ng-template>
    </div>
</div>
```
<a id="importstyles"></a>

`sidebar.component.scss`
```scss
@import '<pathToBlades>/blades/base/blade-host.scss'
```
___
<a id="makeblade"></a>

## Make a blade 

<a id="copyresult"></a>

### Copy Result class
Check app/util for `result.ts`

If result class is not in this project copy from `blades/util`

<a id="makebladecomponent"></a>

### Make blade component
`sidebar/blade.component.ts`

Modify your generated component to the following
```typescript
...
@Component({
    selector: 'blade',
    templateUrl: 'blade.component.html',
    styleUrls: ['./blade.component.scss']
})
export class FooBladeComponent implements Blade {
    title: string;
    parent: Option<Blade>;
    direction: boolean;
    type: Type<FooBladeComponent>;
    close: () => Promise<Result>;
    checkCanClose: () => Promise<boolean>;
    constructor(
        public readonly cdRef: ChangeDetectorRef
    ) { }
}
```
<a id="makebladeinputs"></a>

### Make blade inputs class
`sidebar/blade.component.ts`

At the top of the File add
```typescript
export class FooBladeInputs extends BladeInputs {
    title = 'Foo';
    parent: Option<Blade> = none;
    direction: boolean = right;
    type: Type<FooBladeComponent> = FooBladeComponent;
    close = () => this.checkCanClose()
        .then(canClose => canClose
            ? Result.ok()
            : Result.err('Not Saved'))
    checkCanClose = () => Promise.resolve(true);
}
...
```
<a id="navigate"></a>

### Navigate to blade
`app.component.ts`
```typescript
@Component({
    ...
})
export class AppComponent {
    constructor(
        private bladeService: BladeService
    ) { }

    public openFooBlade(e) {
        this.bladeService.navigateTo(new FooBladeInputs());
    }
}
```
`app.component.html`
```html
...
<div class="right-sidebar">
    <sidebar></sidebar>
</div>
<button (click)="openFooBlade($event)">Open Foo blade</button>
...
```
___
## Optional

<a id="openchild"></a>

### How to Open child blades
Import blade service:

```typescript
@Component({
    selector: 'blade',
    templateUrl: 'blade.component.html',
    styleUrls: ['./blade.component.scss']
})
export class FooBladeComponent implements Blade {
    title: string;
    parent: Option<Blade>;
    direction: boolean;
    type: Type<FooBladeComponent>;
    close: () => Promise<Result>;
    checkCanClose: () => Promise<boolean>;
    constructor(
        public readonly cdRef: ChangeDetectorRef,
        /* >>>*/public readonly bladeService: BladeService /*<<< */
    ) { }
}
```
see [How to navigate to blade](#navigate) to navigate

<a id="bladeinputs"></a>

### How to add inputs to blades

Create an input value like normal.

Add it to the constructor for the inputs class.

```typescript
export class FooBladeInputs extends BladeInputs {
    title = 'Foo';
    parent: Option<Blade> = none;
    direction: boolean = right;
    type: Type<FooBladeComponent> = FooBladeComponent;
    close = () => this.checkCanClose()
        .then(canClose => canClose
            ? Result.ok()
            : Result.err('Not Saved'))
    checkCanClose = () => Promise.resolve(true);
    /*vvvv*/
    constructor(
        public readonly bars: string[]
    )
}

@Component({
    selector: 'blade',
    templateUrl: 'blade.component.html',
    styleUrls: ['./blade.component.scss']
})
export class FooBladeComponent implements Blade {
    title: string;
    parent: Option<Blade>;
    direction: boolean;
    type: Type<FooBladeComponent>;
    /* >>>*/@Input() bars: string[]/*<<< */
    close: () => Promise<Result>;
    checkCanClose: () => Promise<boolean>;
    constructor(
        public readonly cdRef: ChangeDetectorRef
    ) { }
}
```
