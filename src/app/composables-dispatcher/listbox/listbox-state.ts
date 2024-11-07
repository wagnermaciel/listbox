import { Signal } from '@angular/core';
import { FocusInputs, FocusState } from '../focus/focus-state';
import {
  NavigationInputs,
  NavigationState,
} from '../navigation/navigation-state';
import { OptionState } from '../option/option-state';
import { SelectionInputs, SelectionState } from '../selection/selection-state';
import { TypeAheadInputs, TypeaheadState } from '../typeahead/typeahead-state';
import { ListboxController } from './listbox-controller';

export type ListboxInputs<T extends OptionState> = NavigationInputs<T> &
  TypeAheadInputs<T> &
  SelectionInputs<T> &
  FocusInputs<T>;

export class ListboxState<T extends OptionState> {
  readonly orientation: Signal<'horizontal' | 'vertical'>;
  readonly tabindex: Signal<number>;
  readonly multiselectable: Signal<boolean>;
  readonly activedescendant: Signal<string>;
  readonly items: Signal<T[]>;
  readonly focusIndex: Signal<number>;
  readonly activeIndex: Signal<number>;
  readonly selectedIndices: Signal<number[]>;
  readonly query: Signal<string>;

  private readonly focusManager: FocusState<T>;
  private readonly typeaheadManager: TypeaheadState<T>;
  private readonly selectionManager: SelectionState<T>;
  private readonly navigationManager: NavigationState<T>;

  private controller?: ListboxController<ListboxState<T>>;

  constructor(inputs: ListboxInputs<T>) {
    inputs.keydownEvents.listen((event) =>
      this.getController().handleKeydown(event)
    );

    this.focusManager = new FocusState(inputs);
    this.typeaheadManager = new TypeaheadState(inputs);
    this.selectionManager = new SelectionState(inputs);
    this.navigationManager = new NavigationState(inputs);

    this.orientation = inputs.orientation;
    this.tabindex = this.focusManager.tabindex;
    this.multiselectable = inputs.multiselectable;
    this.activedescendant = this.focusManager.activedescendant;
    this.items = inputs.items;
    this.focusIndex = this.focusManager.focusIndex; // TODO: shouldn't need 3 copies of active index
    this.activeIndex = this.focusManager.activeIndex;
    this.selectedIndices = this.selectionManager.selectedIndices;
    this.query = this.typeaheadManager.query;
  }

  getController() {
    // TODO: dynamic import
    const controller = this.controller ?? new ListboxController(this);
    this.controller = controller;
    return controller;
  }
}
