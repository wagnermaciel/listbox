import { computed, signal } from "@angular/core";
import { Item, NavigationState } from "./navigation";

export class NavigationController<T extends Item> {
  constructor(readonly state: NavigationState<T>) {}

  navigateTo(index: number): void {
    if (!this.state.items()[index]?.disabled()) {
      this.state.currentIndex.set(index);
    }
  }

  navigatePrev() {
    this.navigate(this.getPrevIndex);
  }

  navigateNext() {
    this.navigate(this.getNextIndex);
  }

  navigateFirst() {
    this.state.currentIndex.set(this.state.firstIndex());
  }

  navigateLast() {
    this.state.currentIndex.set(this.state.lastIndex());
  }

  getPrevIndex = (index: number) => {
    const prevIndex = this.state.wrap() && index === 0 ? this.state.lastIndex() : index - 1;
    return Math.max(prevIndex, this.state.firstIndex());
  }

  getNextIndex = (index: number) => {
    const nextIndex = this.state.wrap() && index === this.state.lastIndex() ? 0 : index + 1;
    return Math.min(nextIndex, this.state.lastIndex());
  }

  private navigate(navigateFn: (i: number) => number): void {
    const index = signal(this.state.currentIndex());
    const isLoop = computed(() => index() === this.state.currentIndex());
    const shouldSkip = computed(() => this.state.skipDisabled() && this.state.items()[index()]?.disabled());
  
    do {
      index.update(navigateFn);
    } while (shouldSkip() && !isLoop());
  
    this.state.currentIndex.set(index());
  }
}
