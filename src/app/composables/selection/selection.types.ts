import { Signal, WritableSignal } from "@angular/core";

export interface SelectionItem {
  disabled: Signal<boolean>;
  selected: Signal<boolean>;
}

export interface SelectionProps<T extends SelectionItem> {
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

export type SelectionInputs<T extends SelectionItem> = Pick<SelectionProps<T>, 'followFocus' | 'multiselectable' | 'items' | 'currentIndex' | 'selectedIndices'>;
