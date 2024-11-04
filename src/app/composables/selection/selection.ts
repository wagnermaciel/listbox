import { computed, signal } from '@angular/core';
import { SelectionInputs, SelectionItem, SelectionProps } from './selection.types';

export function getSelectionProps<T extends SelectionItem>(args: SelectionInputs<T>): SelectionProps<T> {
  const anchorIndex = signal(-1);
  const selectedItems = computed(() => args.selectedIndices().map((i) => args.items()[i]!));

  const select = () => {
    anchorIndex.set(args.currentIndex());
    if (args.multiselectable()) {
      args.selectedIndices.update(arr => arr.concat([args.currentIndex()]));
    } else {
      args.selectedIndices.set([args.currentIndex()]);
    }
  };
  
  const deselect = () => {
    args.selectedIndices.update(arr => arr.filter((i) => i !== args.currentIndex()));
  };
  
  const toggle = () => {
    args.selectedIndices().includes(args.currentIndex())
      ? deselect()
      : select();
  };

  const selectAll = () => {
    args.selectedIndices.set(args.items().map((v, i) => i));
  };

  const deselectAll = () => {
    args.selectedIndices.set([]);
  };

  const toggleAll = () => {
    if (args.selectedIndices().length === args.items().length) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  const selectFromAnchor = () => {
    if (anchorIndex() === -1) {
      return;
    }
  
    const upper = Math.max(args.currentIndex(), anchorIndex());
    const lower = Math.min(args.currentIndex(), anchorIndex());
    const range = Array.from({ length: upper - lower + 1 }, (_, i) => lower + i);
    args.selectedIndices.update(arr => arr.concat(range));
  };

  return {
    ...args,
    anchorIndex,
    selectedItems,
    toggle,
    select,
    deselect,
    toggleAll,
    selectAll,
    deselectAll,
    selectFromAnchor,
  }
}
