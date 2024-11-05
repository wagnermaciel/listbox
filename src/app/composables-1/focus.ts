import { computed, Signal } from '@angular/core';

interface Item {
  id: Signal<string>;
}

export class FocusComposable<T extends Item> {
  focusIndex = computed(() => (this.rovingFocus() ? this.currentIndex() : -1));
  activeIndex = computed(() => (this.rovingFocus() ? -1 : this.currentIndex()));
  focusItem = computed(() => this.items()[this.focusIndex()]);
  activeItem = computed(() => this.items()[this.activeIndex()]);
  tabindex = computed(() => (this.rovingFocus() ? -1 : 0));
  activedescendant = computed(() => this.activeItem()?.id() ?? null);

  constructor(
    public items: Signal<T[]>,
    public rovingFocus: Signal<boolean>,
    public currentIndex: Signal<number>
  ) {}
}
