import { ListboxInputs, ListboxProps } from './listbox.types';
import { getNavigationProps } from '../navigation/navigation';
import { getSelectionProps } from '../selection/selection';
import { getFocusProps } from '../focus/focus';
import { OptionProps } from '../option/option.types';
import { onKeyDown } from './listbox.keydown';
import { computed } from '@angular/core';
import { getTypeAheadProps } from '../typeahead/typeahead';
import { onPointerDown } from './listbox.pointerdown';

export function getListboxProps<T extends OptionProps>(args: ListboxInputs<T>): ListboxProps<T> {
  const focusProps = getFocusProps(args);
  const typeaheadProps = getTypeAheadProps(args);
  const selectionProps = getSelectionProps(args);
  const navigationProps = getNavigationProps(args);

  return {
    ...args,
    ...focusProps,
    ...selectionProps,
    ...typeaheadProps,
    ...navigationProps,
    orientation: computed(() => args.vertical() ? 'vertical' : 'horizontal'),
    onPointerDown: (e) => onPointerDown(args, navigationProps, selectionProps, e),
    onKeyDown: (e) => onKeyDown(args, navigationProps, typeaheadProps, selectionProps, e),
  };
}
