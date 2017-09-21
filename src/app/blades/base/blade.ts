import { Option, none } from 'ts-option';
import { Injector, QueryList, Type, ChangeDetectorRef } from '@angular/core';
import { Result } from 'app/util/result';

export type leftType = true;
export const left = true;
export type rightType = false;
export const right = false;

export type Direction = leftType | rightType;

/**
 * A template for any components that are to be used as blades.
 * Should be implemented as an interface by components.
 */
export abstract class BladeBase {
    /**
     * The title for the blade. Should be unique and reimplemented locally.
     */
    abstract readonly title: string;
    /**
     * The parent of this blade.
     */
    abstract parent: Option<BladeBase>;
    /**
     * The direction this blade starts at
     */
    abstract direction: Direction;
    /**
     * The type of this Blade, to be used by the blade host to create this blade.
     * Needs to be implemented as concrete type and initialized.
     * @example
     *
     * type: Type<AnotherBladeComponent> = AnotherBladeComponent;
     */
    abstract type: Type<Blade>;
    /**
     * The action to complete on close
     */
    abstract readonly onClose: () => Result;
    /**
     * Action to check if the blade can be closed
     */
    abstract readonly checkCanClose = () => Promise.resolve(true);
}

export abstract class Blade extends BladeBase {
    constructor(
        public readonly cdRef: ChangeDetectorRef
    ) {
        super();
    }
}
