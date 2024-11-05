import { computed, Signal } from "@angular/core";
import { ListboxComposable } from "./listbox";

let counter = -1;

export class OptionComposable {
  id = computed(() => `${counter++}`);
  setsize = computed(() => this.listbox.items().length);
  posinset = computed(() => this.listbox.items().findIndex(item => item.id() === this.id()));
  focused = computed(() => this.listbox.focusManager.focusIndex() === this.posinset());
  active = computed(() => this.listbox.focusManager.activeIndex() === this.posinset());
  selected = computed(() => this.listbox.selectedIndices().includes(this.posinset()));
  tabindex = computed(() => this.focused() ? 0 : -1);

  constructor(
    public listbox: ListboxComposable<OptionComposable>,
    public disabled: Signal<boolean>,
    public searchTerm: Signal<string>,
  ) {}
}
