import { computed, Signal, signal, WritableSignal } from '@angular/core';

export interface Item {
  disabled: Signal<boolean>;
  selected: Signal<boolean>;
}

export interface SelectionInterface<T extends Item> {
  items: Signal<T[]>;
  selectedItems: Signal<T[]>;
  followFocus: Signal<boolean>;
  multiselectable: Signal<boolean>;
  anchorIndex: WritableSignal<number>;
  currentIndex: WritableSignal<number>;
  selectedIndices: WritableSignal<number[]>;

  toggle: () => void;
  select: () => void;
  deselect: () => void;
  toggleAll: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  selectFromAnchor: () => void;
}

export type SelectionInputs<T extends Item> = Pick<SelectionInterface<T>, 'followFocus' | 'multiselectable' | 'items' | 'currentIndex' | 'selectedIndices'>;

export function getSelectionProps<T extends Item>(args: SelectionInputs<T>): SelectionInterface<T> {
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
