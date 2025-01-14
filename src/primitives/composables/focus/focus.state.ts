import { computed, Signal, WritableSignal } from '@angular/core';

export interface Item {
  readonly element: HTMLElement;
  readonly id: Signal<string>;
}

export interface FocusInputs<T extends Item> {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;
}

export class FocusState<T extends Item> {
  readonly element: HTMLElement;
  readonly items: Signal<T[]>;
  readonly rovingFocus: Signal<boolean>;
  readonly currentIndex: WritableSignal<number>;

  readonly focusIndex = computed(() =>
    this.rovingFocus() ? this.currentIndex() : -1,
  );
  readonly activeIndex = computed(() =>
    this.rovingFocus() ? -1 : this.currentIndex(),
  );
  readonly focusItem = computed(() => this.items().at(this.focusIndex()));
  readonly activeItem = computed(() => this.items().at(this.activeIndex()));
  readonly currentItem = computed(() => this.items().at(this.currentIndex()));
  readonly tabindex = computed(() => (this.rovingFocus() ? -1 : 0));
  readonly activedescendant = computed(() => this.activeItem()?.id() ?? null);

  constructor(args: FocusInputs<T>) {
    this.element = args.element;
    this.items = args.items;
    this.rovingFocus = args.rovingFocus;
    this.currentIndex = args.currentIndex;
  }
}
