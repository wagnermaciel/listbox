import { Signal } from '@angular/core';
import { ListboxComposableInterface } from '../listbox/listbox.types';

export interface OptionComposableInterface {
  id: Signal<string>;
  active: Signal<boolean>;
  focused: Signal<boolean>;
  setsize: Signal<number>;
  posinset: Signal<number>;
  tabindex: Signal<number>;
  disabled: Signal<boolean>;
  selected: Signal<boolean>;
  searchTerm: Signal<string>;
  listbox: ListboxComposableInterface<OptionComposableInterface>;
}

export type OptionInputs = Pick<OptionComposableInterface, 'searchTerm' | 'disabled'>
  & { listbox: ListboxComposableInterface<OptionComposableInterface> };
