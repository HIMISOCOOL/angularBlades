import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[blade-host]'
})
export class BladeHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
