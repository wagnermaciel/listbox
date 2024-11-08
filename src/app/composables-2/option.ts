import { computed, Signal } from "@angular/core";
import { ListboxComposable } from "./listbox";

export interface OptionInputs {
  disabled: Signal<boolean>;
  searchTerm: Signal<string>;
  listbox: ListboxComposable<OptionComposable>;
}

let counter = -1;

export class OptionComposable {
  disabled: Signal<boolean>;
  searchTerm: Signal<string>;
  listbox: ListboxComposable<OptionComposable>;

  id = computed(() => `${counter++}`);
  setsize = computed(() => this.listbox.navigationManager.items().length);
  posinset = computed(() => this.listbox.navigationManager.items().findIndex(item => item.id() === this.id()));
  focused = computed(() => this.listbox.focusManager.focusIndex() === this.posinset());
  active = computed(() => this.listbox.focusManager.activeIndex() === this.posinset());
  selected = computed(() => this.listbox.selectionManager.selectedIndices().includes(this.posinset()));
  tabindex = computed(() => this.focused() ? 0 : -1);

  constructor(args: OptionInputs) {
    this.listbox = args.listbox;
    this.disabled = args.disabled;
    this.searchTerm = args.searchTerm;
  }
}
