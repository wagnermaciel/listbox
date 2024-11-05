import { Signal } from '@angular/core';
import { OptionComposableInterface } from '../option/option.types';
import { NavigationInputs } from '../navigation/navigation.types';
import { SelectionInputs } from '../selection/selection.types';
import { FocusInputs } from '../focus/focus.types';
import { TypeAheadInputs } from '../typeahead/typeahead.types';
import { FocusComposable } from '../focus/focus';
import { SelectionComposable } from '../selection/selection';
import { NavigationComposable } from '../navigation/navigation';
import { TypeAheadComposable } from '../typeahead/typeahead';

export interface ListboxComposableInterface<T extends OptionComposableInterface> {
  vertical: Signal<boolean>;
  orientation: Signal<string>;
  tabindex: Signal<number>;
  multiselectable: Signal<boolean>;
  activedescendant: Signal<string>;

  focusManager: FocusComposable<T>;
  typeaheadManager: TypeAheadComposable<T>;
  selectionManager: SelectionComposable<T>;
  navigationManager: NavigationComposable<T>;

  onKeyDown: (event: KeyboardEvent) => void;
  onPointerDown: (event: PointerEvent) => void;
}

export type ListboxInputs<T extends OptionComposableInterface> = Pick<ListboxComposableInterface<T>, 'vertical'>
  & NavigationInputs<T>
  & TypeAheadInputs<T>
  & SelectionInputs<T>
  & FocusInputs<T>;
