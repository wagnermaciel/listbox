import { Item, SelectionState } from './selection';

export class SelectionController<T extends Item> {
  constructor(readonly state: SelectionState<T>) {}

  select() {
    this.state.anchorIndex.set(this.state.currentIndex());
    const item = this.state.items().at(this.state.currentIndex());

    if (!this.state.multiselectable()) {
      this.deselectAll();
    }

    item?.selected.set(true);
  }

  deselect() {
    const item = this.state.items().at(this.state.currentIndex());
    item?.selected.set(false);
  }

  toggle() {
    const item = this.state.items().at(this.state.currentIndex());
    item?.selected() ? this.deselect() : this.select();
  }

  selectAll() {
    for (const item of this.state.items()) {
      item.selected.set(true);
    }
  }

  deselectAll() {
    for (const item of this.state.items()) {
      item.selected.set(false);
    }
  }

  toggleAll() {
    if (this.state.items().some(item => !item.selected())) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }

  selectFromAnchor() {
    if (this.state.anchorIndex() === -1) {
      return;
    }

    const upper = Math.max(this.state.currentIndex(), this.state.anchorIndex());
    const lower = Math.min(this.state.currentIndex(), this.state.anchorIndex());

    for (let i = lower; i <= upper; i++) {
      this.state.items().at(i)?.selected.set(true);
    }
  }
}
