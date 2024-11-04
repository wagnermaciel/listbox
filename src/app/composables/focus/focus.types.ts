import { Signal, WritableSignal } from "@angular/core";

export interface FocusItem {
  id: Signal<string>;
}

export interface FocusProps<T extends FocusItem> {
  items: Signal<T[]>;
  tabindex: Signal<number>;
  focusIndex: Signal<number>;
  activeIndex: Signal<number>;
  rovingFocus: Signal<boolean>;
  focusItem: Signal<T | undefined>;
  activeItem: Signal<T | undefined>;
  currentIndex: WritableSignal<number>;
  activedescendant: Signal<string | null>;
}

export type FocusInputs<T extends FocusItem> = Pick<FocusProps<T>, 'items' | 'rovingFocus' | 'currentIndex'>;
