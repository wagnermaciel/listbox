import { computed, Signal } from "@angular/core";
import { ListboxInterface } from "./listbox";

export interface OptionInterface {
  id: Signal<string>;
  active: Signal<boolean>;
  focused: Signal<boolean>;
  setsize: Signal<number>;
  posinset: Signal<number>;
  tabindex: Signal<number>;
  disabled: Signal<boolean>;
  selected: Signal<boolean>;
  searchTerm: Signal<string>;
  listbox: ListboxInterface<OptionInterface>;
}

export type OptionInputs = Pick<OptionInterface, 'listbox' | 'searchTerm' | 'disabled'>;

let counter = -1;

export function getOptionProps(args: OptionInputs): OptionInterface {
  const id = computed(() => `${counter++}`);
  const setsize = computed(() => args.listbox.items().length);
  const posinset = computed(() => args.listbox.items().findIndex(item => item.id() === id()));
  const focused = computed(() => args.listbox.focusIndex() === posinset());
  const active = computed(() => args.listbox.activeIndex() === posinset());
  const selected = computed(() => args.listbox.selectedIndices().includes(posinset()));
  const tabindex = computed(() => focused() ? 0 : -1);

  return {
    ...args,
    id,
    active,
    setsize,
    focused,
    posinset,
    selected,
    tabindex,
  }
}
