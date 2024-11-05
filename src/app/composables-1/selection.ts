import { computed, Signal, signal, WritableSignal } from '@angular/core';

export interface Item {
  disabled: Signal<boolean>;
  selected: Signal<boolean>;
}

export class SelectionComposable<T extends Item> {
  anchorIndex = signal(-1);
  selectedItems = computed(() => this.selectedIndices().map((i) => this.items()[i]!));

  constructor(
    public items: Signal<T[]>,
    public followFocus: Signal<boolean>,
    public multiselectable: Signal<boolean>,
    public currentIndex: WritableSignal<number>,
    public selectedIndices: WritableSignal<number[]>,
  ) {}

  select() {
    this.anchorIndex.set(this.currentIndex());
    if (this.multiselectable()) {
      this.selectedIndices.update(arr => arr.concat([this.currentIndex()]));
    } else {
      this.selectedIndices.set([this.currentIndex()]);
    }
  };
  
  deselect() {
    this.selectedIndices.update(arr => arr.filter((i) => i !== this.currentIndex()));
  };
  
  toggle() {
    this.selectedIndices().includes(this.currentIndex())
      ? this.deselect()
      : this.select();
  };

  selectAll() {
    this.selectedIndices.set(this.items().map((v, i) => i));
  };

  deselectAll() {
    this.selectedIndices.set([]);
  };

  toggleAll() {
    if (this.selectedIndices().length === this.items().length) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  };

  selectFromAnchor() {
    if (this.anchorIndex() === -1) {
      return;
    }
  
    const upper = Math.max(this.currentIndex(), this.anchorIndex());
    const lower = Math.min(this.currentIndex(), this.anchorIndex());
    const range = Array.from({ length: upper - lower + 1 }, (_, i) => lower + i);
    this.selectedIndices.update(arr => arr.concat(range));
  };
}
