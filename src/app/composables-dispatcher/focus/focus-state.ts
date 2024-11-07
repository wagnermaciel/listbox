import { computed, Signal, WritableSignal } from '@angular/core';

interface Item {
  readonly id: Signal<string>;
}

export interface FocusInputs<T extends Item> {
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
}

export class FocusState<T extends Item> {
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;

  readonly focusIndex = computed(() =>
    this.rovingFocus() ? this.currentIndex() : -1
  );
  readonly activeIndex = computed(() =>
    this.rovingFocus() ? -1 : this.currentIndex()
  );
  readonly focusItem = computed(() => this.items()[this.focusIndex()]);
  readonly activeItem = computed(() => this.items()[this.activeIndex()]);
  readonly tabindex = computed(() => (this.rovingFocus() ? -1 : 0));
  readonly activedescendant = computed(() => this.activeItem()?.id() ?? null);

  constructor(inputs: FocusInputs<T>) {
    this.items = inputs.items;
    this.rovingFocus = inputs.rovingFocus;
    this.currentIndex = inputs.currentIndex;
  }
}
