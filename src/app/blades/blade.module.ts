import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BladeHostDirective } from './directives/blade-host.directive';
import { BladeService } from './blade.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [BladeHostDirective],
    exports: [BladeHostDirective]
})
export class BladeModule {
    constructor( @Optional() @SkipSelf() parentModule: BladeModule) {
        if (parentModule) {
            throw new Error('BladeModule is already loaded. It should only be imported in your application\'s main module.');
        }
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: BladeModule,
            providers: [
                BladeService
            ]
        };
    }
}
