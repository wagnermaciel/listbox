import { NavigationProps } from "../navigation/navigation.types";
import { OptionProps } from "../option/option.types";
import { SelectionProps } from "../selection/selection.types";
import { TypeAheadProps } from "../typeahead/typeahead.types";
import { ListboxInputs } from "./listbox.types";

export function onKeyDown<T extends OptionProps>(listbox: ListboxInputs<T>, navigation: NavigationProps<T>, typeaheadProps: TypeAheadProps<T>, selection: SelectionProps<T>, event: KeyboardEvent) {
  handleNavigation(listbox, navigation, typeaheadProps, event);
  if (listbox.multiselectable()) {
    handleMultiSelection(listbox, selection, event);
  } else {
    handleSingleSelection(selection, event);
  }
}

function handleNavigation<T extends OptionProps>(listbox: ListboxInputs<T>, navigation: NavigationProps<T>, typeaheadProps: TypeAheadProps<T>, event: KeyboardEvent) {
  const upOrLeft = listbox.vertical() ? 'ArrowUp' : 'ArrowLeft';
  const downOrRight = listbox.vertical() ? 'ArrowDown' : 'ArrowRight';

  if (event.key === ' ' || event.key === downOrRight || event.key === upOrLeft) {
    event.preventDefault();
  }

  switch (event.key) {
    case downOrRight:
      navigation.navigateNext();
      break;
    case upOrLeft:
      navigation.navigatePrev();
      break;
    case 'Home':
      navigation.navigateFirst();
      break;
    case 'End':
      navigation.navigateLast();
      break;
  }

  typeaheadProps.search(event.key);
}

function handleSingleSelection<T extends OptionProps>(selection: SelectionProps<T>, event: KeyboardEvent) {
  if (selection.followFocus()) {
    selection.select();
    return;
  }

  if (event.key === ' ') {
    selection.toggle();
  }
}

function handleMultiSelection<T extends OptionProps>(listbox: ListboxInputs<T>, selection: SelectionProps<T>, event: KeyboardEvent) {
  const upOrLeft = listbox.vertical() ? 'ArrowUp' : 'ArrowLeft';
  const downOrRight = listbox.vertical() ? 'ArrowDown' : 'ArrowRight';

  if (event.ctrlKey) {
    if (event.key === 'a') {
      selection.toggleAll();
      return;
    }
  }

  if (event.ctrlKey && event.shiftKey) {
    if (event.key === 'Home' || event.key === 'End') {
      selection.selectFromAnchor();
      return;
    }
  }

  if (event.shiftKey) {
    if (event.key === ' ') {
      selection.selectFromAnchor();
      return;
    } else if (event.key === downOrRight || event.key === upOrLeft) {
      selection.toggle();
      return;
    }
  }

  if (event.key === ' ') {
    selection.toggle();
  }
}
