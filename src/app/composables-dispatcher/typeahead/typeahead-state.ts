import { Signal, signal, WritableSignal } from '@angular/core';
import { EventDispatcher } from '../event-dispatcher';
import { TypeaheadController } from './typeahead-controller';

export interface Item {
  readonly searchTerm: Signal<string>;
}

export interface TypeAheadInputs<T extends Item> {
  readonly items: Signal<T[]>;
  readonly delay: Signal<number>;
  readonly matcher: Signal<RegExp>;
  readonly currentIndex: WritableSignal<number>;
  readonly keydownEvents: EventDispatcher<KeyboardEvent>;
}

export class TypeaheadState<T extends Item> {
  readonly items: Signal<T[]>;
  readonly delay: Signal<number>;
  readonly matcher: Signal<RegExp>;
  readonly currentIndex: WritableSignal<number>;
  readonly query = signal('');

  private controller?: TypeaheadController<TypeaheadState<T>>;

  constructor(inputs: TypeAheadInputs<T>) {
    inputs.keydownEvents.listen((event) =>
      this.getController().handleKeydown(event)
    );

    this.items = inputs.items;
    this.delay = inputs.delay;
    this.matcher = inputs.matcher;
    this.currentIndex = inputs.currentIndex;
  }

  getController() {
    // TODO: dynamic import
    const controller = this.controller ?? new TypeaheadController(this);
    this.controller = controller;
    return controller;
  }
}
