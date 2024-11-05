import { Signal, WritableSignal } from '@angular/core';

export interface NavigationItem {
  disabled: Signal<boolean>;
}

export interface NavigationComposableInterface<T extends NavigationItem> {
  wrap: Signal<boolean>;
  items: Signal<T[]>;
  skipDisabled: Signal<boolean>;
  currentItem: Signal<T | undefined>;
  currentIndex: WritableSignal<number>;
  firstIndex: Signal<number>;
  lastIndex: Signal<number>;

  navigateTo: (i: number) => void;
  navigatePrev: () => void;
  navigateNext: () => void;
  navigateFirst: () => void;
  navigateLast: () => void;
}

export type NavigationInputs<T extends NavigationItem> = Pick<
  NavigationComposableInterface<T>,
  'items' | 'wrap' | 'skipDisabled' | 'currentIndex'
>;
