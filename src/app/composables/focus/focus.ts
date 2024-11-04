import { computed } from "@angular/core";
import { FocusItem, FocusInputs, FocusProps } from "./focus.types";

export function getFocusProps<T extends FocusItem>(args: FocusInputs<T>): FocusProps<T> {
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
