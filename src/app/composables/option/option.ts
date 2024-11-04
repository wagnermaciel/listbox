import { computed } from "@angular/core";
import { OptionInputs, OptionProps } from "./option.types";

let counter = -1;

export function getOptionProps(args: OptionInputs): OptionProps {
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
