import { computed, Signal, WritableSignal } from "@angular/core";

export interface Item {
  id: Signal<string>;
}

export interface FocusInterface<T extends Item> {
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

export type FocusInputs<T extends Item> = Pick<FocusInterface<T>, 'items' | 'rovingFocus' | 'currentIndex'>;

export function getFocusProps<T extends Item>(args: FocusInputs<T>): FocusInterface<T> {
  const focusIndex = computed(() => args.rovingFocus() ? args.currentIndex() : -1);
  const activeIndex = computed(() => args.rovingFocus() ? -1 : args.currentIndex());

  const focusItem = computed(() => args.items()[focusIndex()]);
  const activeItem = computed(() => args.items()[activeIndex()]);

  const tabindex = computed(() => args.rovingFocus() ? -1 : 0);
  const activedescendant = computed(() => activeItem()?.id() ?? null);

  return {
    ...args,
    tabindex,
    focusItem,
    activeItem,
    focusIndex,
    activeIndex,
    activedescendant,
  };
}
