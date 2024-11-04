import { Signal } from '@angular/core';
import { ListboxProps } from '../listbox/listbox.types';

export interface OptionProps {
  id: Signal<string>;
  active: Signal<boolean>;
  focused: Signal<boolean>;
  setsize: Signal<number>;
  posinset: Signal<number>;
  tabindex: Signal<number>;
  disabled: Signal<boolean>;
  selected: Signal<boolean>;
  searchTerm: Signal<string>;
}

export type OptionInputs = Pick<OptionProps, 'searchTerm' | 'disabled'>
  & { listbox: ListboxProps<OptionProps> };
