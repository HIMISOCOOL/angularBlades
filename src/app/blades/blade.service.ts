import { BehaviorSubject } from 'rxjs/Rx';
import {
    Injectable,
    ViewContainerRef,
    ComponentFactoryResolver,
    Type
} from '@angular/core';
import { Direction, Blade, BladeBase } from './base/blade';
import { BladeInputs } from './base/blade-inputs';
import { Option, option, none, some } from 'ts-option';
import { Result, ok, err } from 'app/util/result';

async function checkLastBladeCanClose(lastBlade: BladeInputs) {
    let lastBladeMut = lastBlade.parent;
    let canClose = false;
    // check last blade parent.parent until none
    while (lastBladeMut !== none) {
        canClose = await lastBladeMut.get.checkCanClose();
        lastBladeMut = lastBladeMut.get.parent;
    }
    return canClose;
}

@Injectable()
/**
 * A service to manage blades
 */
export class BladeService {
    public blades: BladeInputs[];
    public blade$: BehaviorSubject<Option<BladeInputs>>;

    constructor() {
        this.blades = [];
        this.blade$ = new BehaviorSubject(none);
    }

    /**
     * Creates a blade
     */
    public static createBlade =
    /**
     * @param componentFactoryResolver The component factory service from the calling scope
     * @param viewContainerRef The viewContainerRef from the calling scope
     * @param inputs The inputs for the component
     */
    <T extends BladeInputs>(
        componentFactoryResolver: ComponentFactoryResolver,
        viewContainerRef: ViewContainerRef,
        inputs: T
    ) => {
        const component = viewContainerRef.createComponent(componentFactoryResolver.resolveComponentFactory(inputs.type));
        const instance = component.instance;
        for (const input in inputs as BladeBase) {
            if (instance[input] == null) {
                instance[input] = inputs[input];
            }
        }
        instance.cdRef.detectChanges();
        return component;
    }

    /**
     * Checks if the last blade in the list is the same as the parent of the new blade, if so removes it.
     * @param blades the blades list to check
     * @param newBladeParent the parent of the new blade
     */
    // tslint:disable-next-line:member-ordering
    private static async checkForBladeReplace(blades: BladeInputs[], newBlade: BladeInputs) {

        const lastBlade = blades[blades.length - 1];
        const closeBlade = async function (blade: BladeInputs) {
            const result = await blade.onClose();
            const removedBlade = Result.from(blades.pop());
            return Result.firstErrOrOk(result, removedBlade);
        };
        // newblades parent is last blade or there is no last blade
        if (lastBlade == null || (newBlade.parent.isDefined && newBlade.parent.get.title === lastBlade.title)) {
            // nothing
            return { blades, result: ok(newBlade) };
        }

        const canClose = newBlade.parent === lastBlade.parent || newBlade.direction !== lastBlade.direction
            ? await lastBlade.checkCanClose()
            : await checkLastBladeCanClose(lastBlade);
        const result = canClose
            ? await closeBlade(lastBlade)
            : Result.err('Could not close blade');
        return { blades, result };
    }

    private nextFluent = <T>(subject: BehaviorSubject<T>) => (value: T) => {
        subject.next(value);
        return value;
    }

    /**
     * Pushes a new blade to the service, to be shown in a blade container
     * @param blade The blade to push to the service
     */
    public async navigateTo(blade: BladeInputs) {
        const { blades, result } = await BladeService.checkForBladeReplace(this.blades, blade);
        const blade$Next = (value: BladeInputs) => {
            this.blades.push(blade);
            this.nextFluent(this.blade$)(some(value));
            return blade;
        };
        return result.isSuccess
            ? ok(blade$Next(blade))
            : err<Blade>(result.error);
    }

    /**
     * Tries to close a blade
     * @param index The index of the blade to close
     */
    public async tryCloseBlade(index: number) {
        const blade = this.blades[index];
        const canClose = await blade.checkCanClose();
        if (canClose) {
            this.blades = index < this.blades.length - 1
                ? this.blades = []
                : this.blades.filter(b => b.title !== blade.title);
            this.blade$.next(none);
        }
        return blade.onClose();
    }
}

