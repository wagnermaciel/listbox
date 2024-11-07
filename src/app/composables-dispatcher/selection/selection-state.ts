import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { EventDispatcher } from '../event-dispatcher';
import { SelectionController } from './selection-controller';

interface Item {
  readonly disabled: Signal<boolean>;
  readonly selected: Signal<boolean>;
}

export interface SelectionInputs<T extends Item> {
  readonly items: Signal<T[]>;
  readonly followFocus: Signal<boolean>;
  readonly multiselectable: Signal<boolean>;
  readonly orientation: Signal<'horizontal' | 'vertical'>;
  readonly currentIndex: WritableSignal<number>;
  readonly selectedIndices: WritableSignal<number[]>;
  readonly keydownEvents: EventDispatcher<KeyboardEvent>;
  readonly pointerdownEvents: EventDispatcher<PointerEvent>;
}

export class SelectionState<T extends Item> {
  readonly items: Signal<T[]>;
  readonly followFocus: Signal<boolean>;
  readonly multiselectable: Signal<boolean>;
  readonly orientation: Signal<'horizontal' | 'vertical'>;
  readonly currentIndex: WritableSignal<number>;
  readonly selectedIndices: WritableSignal<number[]>;

  private controller?: SelectionController<SelectionState<T>>;

  readonly anchorIndex = signal(-1);
  readonly selectedItems = computed(() =>
    this.selectedIndices().map((i) => this.items()[i]!)
  );

  constructor(inputs: SelectionInputs<T>) {
    inputs.keydownEvents.listen((event) =>
      this.getController().handleKeydown(event)
    );
    inputs.pointerdownEvents.listen((event) =>
      this.getController().handlePointerdown(event)
    );

    this.items = inputs.items;
    this.followFocus = inputs.followFocus;
    this.multiselectable = inputs.multiselectable;
    this.orientation = inputs.orientation;
    this.currentIndex = inputs.currentIndex;
    this.selectedIndices = inputs.selectedIndices;
  }

  getController() {
    // TODO: dynamic import
    const controller = this.controller ?? new SelectionController(this);
    this.controller = controller;
    return controller;
  }
}
