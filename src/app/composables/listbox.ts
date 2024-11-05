import { getNavigationProps, NavigationInputs, NavigationInterface } from './navigation';
import { computed, Signal } from '@angular/core';
import { getTypeAheadProps, TypeAheadInputs, TypeAheadInterface } from './typeahead';
import { OptionInterface } from './option';
import { getSelectionProps, SelectionInputs, SelectionInterface } from './selection';
import { FocusInputs, FocusInterface, getFocusProps } from './focus';

export interface ListboxInterface<T extends OptionInterface>
  extends NavigationInterface<T>,
    SelectionInterface<T>,
    FocusInterface<T>,
    TypeAheadInterface<T> {
  vertical: Signal<boolean>;
  orientation: Signal<string>;

  onKeyDown: (event: KeyboardEvent) => void;
  onPointerDown: (event: PointerEvent) => void;
}

export type ListboxInputs<T extends OptionInterface> = Pick<
  ListboxInterface<T>,
  'vertical'
> &
  NavigationInputs<T> &
  TypeAheadInputs<T> &
  SelectionInputs<T> &
  FocusInputs<T>;

export function getListboxProps<T extends OptionInterface>(
  args: ListboxInputs<T>
): ListboxInterface<T> {
  const focusProps = getFocusProps(args);
  const typeaheadProps = getTypeAheadProps(args);
  const selectionProps = getSelectionProps(args);
  const navigationProps = getNavigationProps(args);

  const handleNavigation = (event: KeyboardEvent) => {
    const upOrLeft = args.vertical() ? 'ArrowUp' : 'ArrowLeft';
    const downOrRight = args.vertical() ? 'ArrowDown' : 'ArrowRight';

    if (
      event.key === ' ' ||
      event.key === downOrRight ||
      event.key === upOrLeft
    ) {
      event.preventDefault();
    }

    switch (event.key) {
      case downOrRight:
        navigationProps.navigateNext();
        break;
      case upOrLeft:
        navigationProps.navigatePrev();
        break;
      case 'Home':
        navigationProps.navigateFirst();
        break;
      case 'End':
        navigationProps.navigateLast();
        break;
    }

    typeaheadProps.search(event.key);
  };

  const handleSingleSelection = (event: KeyboardEvent) => {
    if (selectionProps.followFocus()) {
      selectionProps.select();
      return;
    }

    if (event.key === ' ') {
      selectionProps.toggle();
    }
  };

  const handleMultiSelection = (event: KeyboardEvent) => {
    const upOrLeft = args.vertical() ? 'ArrowUp' : 'ArrowLeft';
    const downOrRight = args.vertical() ? 'ArrowDown' : 'ArrowRight';

    if (event.ctrlKey) {
      if (event.key === 'a') {
        selectionProps.toggleAll();
        return;
      }
    }

    if (event.ctrlKey && event.shiftKey) {
      if (event.key === 'Home' || event.key === 'End') {
        selectionProps.selectFromAnchor();
        return;
      }
    }

    if (event.shiftKey) {
      if (event.key === ' ') {
        selectionProps.selectFromAnchor();
        return;
      } else if (event.key === downOrRight || event.key === upOrLeft) {
        selectionProps.toggle();
        return;
      }
    }

    if (event.key === ' ') {
      selectionProps.toggle();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    handleNavigation(event);
    if (args.multiselectable()) {
      handleMultiSelection(event);
    } else {
      handleSingleSelection(event);
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.target instanceof HTMLElement) {
      const li = event.target.closest('li');

      if (li) {
        const index = args.items().findIndex((i) => i.id() === li.id);
        navigationProps.navigateTo(index);
        args.multiselectable()
          ? selectionProps.toggle()
          : selectionProps.select();
      }
    }
  };

  return {
    ...args,
    ...focusProps,
    ...selectionProps,
    ...typeaheadProps,
    ...navigationProps,
    orientation: computed(() => (args.vertical() ? 'vertical' : 'horizontal')),
    onKeyDown,
    onPointerDown,
  };
}
