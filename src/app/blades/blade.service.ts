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
import { Result, ok, err, ResultT } from 'app/util/result';

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
     * decides how to deal with the new blade in relation to existing blades.
     * @param blades the blades list to check
     * @param newBladeParent the parent of the new blade
     */
    private static async checkForBladeReplace(blades: BladeInputs[], newBlade: BladeInputs) {
        const lastBlade = blades[blades.length - 1];
        const newBladeIsChildOfOld = newBlade.parent.isDefined && newBlade.parent.get.title === lastBlade.title;
        if (lastBlade == null || newBladeIsChildOfOld) {
            // no need for replace
            return { blades, result: ok(newBlade) };
        }
        const bladeError = Result.err('Could not close blade');
        const bladesHaveSameDirection = newBlade.direction === lastBlade.direction;
        if (!bladesHaveSameDirection) {
            const reduceCheckCanClose = (prev: Promise<boolean>, curr: BladeInputs) => prev.then(pre => pre && curr.checkCanClose());
            const reduceOnCloseResults = async function (prev: Promise<Result>, curr: BladeInputs) {
                const result = await Promise.all([prev, curr.close()])
                    .then(results => Result.firstErrOrOk(...results));
                return result;
            };
            // close all blades
            const canClose = await blades.reduce(reduceCheckCanClose, Promise.resolve(true));
            return canClose
                ? { blades: [], result: await blades.reduce(reduceOnCloseResults, Promise.resolve(Result.ok())) }
                : { blades, result: bladeError };
        }
        const bladesHaveSameParent = newBlade.parent === lastBlade.parent;
        if (bladesHaveSameDirection) {
            // close the last blade
            const canClose = await lastBlade.checkCanClose();
            return canClose
                ? { blades: blades.filter(b => b !== lastBlade), result: await lastBlade.close() }
                : { blades, result: bladeError };
        }
        return { blades, result: bladeError };
    }

    private nextFluent = <T>(subject: BehaviorSubject<T>, value: T) => {
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
            this.blades.push(value);
            this.nextFluent(this.blade$, some(value));
            return value;
        };
        this.blades = blades;
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
        return blade.close();
    }
}

