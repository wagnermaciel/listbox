import { NavigationProps } from "../navigation/navigation.types";
import { OptionProps } from "../option/option.types";
import { SelectionProps } from "../selection/selection.types";
import { ListboxInputs } from "./listbox.types";

export function onPointerDown<T extends OptionProps>(listboxProps: ListboxInputs<T>, navigationProps: NavigationProps<T>, selectionProps: SelectionProps<T>, e: PointerEvent) {
  if (e.target instanceof HTMLElement) {
    const li = e.target.closest('li');

    if (li) {
      const index = listboxProps.items().findIndex(i => i.id() === li.id);
      navigationProps.navigateTo(index);
      listboxProps.multiselectable() ? selectionProps.toggle() : selectionProps.select();
    }
  }
}
