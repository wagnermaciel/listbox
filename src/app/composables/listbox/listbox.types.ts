import { Signal } from '@angular/core';
import { OptionProps } from '../option/option.types';
import { NavigationInputs, NavigationProps } from '../navigation/navigation.types';
import { SelectionInputs, SelectionProps } from '../selection/selection.types';
import { FocusInputs, FocusProps } from '../focus/focus.types';
import { TypeAheadInputs, TypeAheadProps } from '../typeahead/typeahead.types';

export interface ListboxProps<T extends OptionProps> extends NavigationProps<T>, SelectionProps<T>, FocusProps<T>, TypeAheadProps<T> {
  vertical: Signal<boolean>;
  orientation: Signal<string>;

  onKeyDown: (event: KeyboardEvent) => void;
  onPointerDown: (event: PointerEvent) => void;
}

export type ListboxInputs<T extends OptionProps> = Pick<ListboxProps<T>, 'vertical'>
  & NavigationInputs<T>
  & TypeAheadInputs<T>
  & SelectionInputs<T>
  & FocusInputs<T>;
