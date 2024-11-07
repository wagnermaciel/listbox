import { type SelectionState } from './selection-state';

export class SelectionController<T extends SelectionState<any>> {
  constructor(private readonly state: T) {}

  handlePointerdown(event: PointerEvent) {
    if (event.target instanceof HTMLElement) {
      const li = event.target.closest('li');

      if (li) {
        const index = this.state.items().findIndex((i) => i.id() === li.id);
        this.state.multiselectable() ? this.toggle() : this.select();
      }
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (this.state.multiselectable()) {
      this.handleKeydownForMultiselection(event);
    } else {
      this.handleKeydownForSingleSelection(event);
    }
  }

  private handleKeydownForMultiselection(event: KeyboardEvent) {
    const upOrLeft =
      this.state.orientation() === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const downOrRight =
      this.state.orientation() === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    if (event.ctrlKey) {
      if (event.key === 'a') {
        this.toggleAll();
        event.preventDefault();
        return;
      }
    }

    if (event.ctrlKey && event.shiftKey) {
      if (event.key === 'Home' || event.key === 'End') {
        this.selectFromAnchor();
        event.preventDefault();
        return;
      }
    }

    if (event.shiftKey) {
      if (event.key === ' ') {
        this.selectFromAnchor();
        event.preventDefault();
        return;
      } else if (event.key === downOrRight || event.key === upOrLeft) {
        this.toggle();
        event.preventDefault();
        return;
      }
    }

    if (event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  private handleKeydownForSingleSelection(event: KeyboardEvent) {
    // TODO: shouldn't this just be part of the computed()?
    if (this.state.followFocus()) {
      this.select();
      return;
    }

    switch (event.key) {
      case ' ':
        this.toggle();
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  select() {
    this.state.anchorIndex.set(this.state.currentIndex());
    if (this.state.multiselectable()) {
      this.state.selectedIndices.update((arr) =>
        arr.concat([this.state.currentIndex()])
      );
    } else {
      this.state.selectedIndices.set([this.state.currentIndex()]);
    }
  }

  deselect() {
    this.state.selectedIndices.update((arr) =>
      arr.filter((i) => i !== this.state.currentIndex())
    );
  }

  toggle() {
    this.state.selectedIndices().includes(this.state.currentIndex())
      ? this.deselect()
      : this.select();
  }

  selectAll() {
    this.state.selectedIndices.set(this.state.items().map((_, i) => i));
  }

  deselectAll() {
    this.state.selectedIndices.set([]);
  }

  toggleAll() {
    if (this.state.selectedIndices().length === this.state.items().length) {
      this.deselectAll();
    } else {
      this.selectAll();
    }
  }

  selectFromAnchor() {
    if (this.state.anchorIndex() === -1) {
      return;
    }

    const upper = Math.max(this.state.currentIndex(), this.state.anchorIndex());
    const lower = Math.min(this.state.currentIndex(), this.state.anchorIndex());
    const range = Array.from(
      { length: upper - lower + 1 },
      (_, i) => lower + i
    );
    this.state.selectedIndices.update((arr) => arr.concat(range));
  }
}
