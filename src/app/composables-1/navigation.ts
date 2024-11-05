import { computed, Signal, signal, WritableSignal } from "@angular/core";

interface Item {
  disabled: Signal<boolean>;
}

export class NavigationComposable<T extends Item> {
  currentItem = computed(() => this.items()[this.currentIndex()]);

  firstIndex = computed(() => {
    if (!this.skipDisabled()) {
      return 0;
    }
    return this.items().findIndex((i) => !i.disabled()) ?? -1;
  });

  lastIndex = computed(() => {
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

  constructor(
    public wrap: Signal<boolean>,
    public items: Signal<T[]>,
    public skipDisabled: Signal<boolean>,
    public currentIndex: WritableSignal<number>,
  ) {}

  navigateTo(index: number): void {
    if (!this.items()[index]?.disabled()) {
      this.currentIndex.set(index);
    }
  }

  navigatePrev() {
    this.navigate(this.getPrevIndex);
  }

  navigateNext() {
    this.navigate(this.getNextIndex);
  }

  navigateFirst() {
    this.currentIndex.set(this.firstIndex());
  }

  navigateLast() {
    this.currentIndex.set(this.lastIndex());
  }

  private getPrevIndex = (index: number) => {
    const prevIndex = this.wrap() && index === 0 ? this.lastIndex() : index - 1;
    return Math.max(prevIndex, this.firstIndex());
  }

  private getNextIndex = (index: number) => {
    const nextIndex = this.wrap() && index === this.lastIndex() ? 0 : index + 1;
    return Math.min(nextIndex, this.lastIndex());
  }

  private navigate(navigateFn: (i: number) => number): void {
    const index = signal(this.currentIndex());
    const isLoop = computed(() => index() === this.currentIndex());
    const shouldSkip = computed(() => this.skipDisabled() && this.items()[index()]?.disabled());
  
    do {
      index.update(navigateFn);
    } while (shouldSkip() && !isLoop());
  
    this.currentIndex.set(index());
  }
}
