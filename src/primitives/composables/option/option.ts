import { computed, Signal, WritableSignal } from "@angular/core";
import { ListboxState } from "../listbox/listbox";

export interface OptionInputs {
  selected: WritableSignal<boolean>;
  disabled: Signal<boolean>;
  searchTerm: Signal<string>;
  listbox: ListboxState<OptionState>;
}

let counter = -1;

export class OptionState {
  selected: WritableSignal<boolean>;
  disabled: Signal<boolean>;
  searchTerm: Signal<string>;
  listbox: ListboxState<OptionState>;

  id = computed(() => `${counter++}`);
  setsize = computed(() => this.listbox.navigationState.items().length);
  posinset = computed(() => this.listbox.navigationState.items().findIndex(item => item.id() === this.id()));
  focused = computed(() => this.listbox.focusState.focusIndex() === this.posinset());
  active = computed(() => this.listbox.focusState.activeIndex() === this.posinset());
  tabindex = computed(() => this.focused() ? 0 : -1);

  constructor(args: OptionInputs) {
    this.listbox = args.listbox;
    this.selected = args.selected;
    this.disabled = args.disabled;
    this.searchTerm = args.searchTerm;
  }
}
