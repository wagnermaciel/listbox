import { computed, Signal, WritableSignal } from '@angular/core';
import { EventDispatcher } from '../event-dispatcher';
import { NavigationController } from './navigation-controller';

interface Item {
  readonly disabled: Signal<boolean>;
}

export interface NavigationInputs<T extends Item> {
  readonly wrap: Signal<boolean>;
  readonly items: Signal<T[]>;
  readonly skipDisabled: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>; // TODO: should we just require `Signal` and created a `linkedSignal` on it?
  readonly orientation: Signal<'horizontal' | 'vertical'>;
  readonly keydownEvents: EventDispatcher<KeyboardEvent>;
  readonly pointerdownEvents: EventDispatcher<PointerEvent>;
}

export class NavigationState<T extends Item> {
  readonly wrap: Signal<boolean>;
  readonly items: Signal<T[]>;
  readonly skipDisabled: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
  readonly orientation: Signal<'horizontal' | 'vertical'>;

  private controller?: NavigationController<NavigationState<T>>;

  readonly currentItem = computed(() => this.items()[this.currentIndex()]);

  readonly firstIndex = computed(() => {
    if (!this.skipDisabled()) {
      return 0;
    }
    return this.items().findIndex((i) => !i.disabled()) ?? -1;
  });

  readonly lastIndex = computed(() => {
    const items = this.items();

    if (!this.skipDisabled()) {
      return items.length - 1;
    }

    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].disabled()) {
        return i;
      }
    }

    return -1;
  });

  constructor(inputs: NavigationInputs<T>) {
    inputs.keydownEvents.listen((event) =>
      this.getController().handleKeydown(event)
    );
    inputs.pointerdownEvents.listen((event) =>
      this.getController().handlePointerdown(event)
    );

    this.wrap = inputs.wrap;
    this.items = inputs.items;
    this.skipDisabled = inputs.skipDisabled;
    this.currentIndex = inputs.currentIndex;
    this.orientation = inputs.orientation;
  }

  getController() {
    // TODO: dynamic import
    const controller = this.controller ?? new NavigationController(this);
    this.controller = controller;
    return controller;
  }
}
