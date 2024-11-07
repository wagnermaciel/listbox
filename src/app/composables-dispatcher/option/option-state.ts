import { computed, Signal } from '@angular/core';
import { ListboxState } from '../listbox/listbox-state';

export interface OptionInputs {
  readonly disabled: Signal<boolean>;
  readonly searchTerm: Signal<string>;
  readonly listbox: ListboxState<OptionState>;
}

let counter = -1;

export class OptionState {
  readonly disabled: Signal<boolean>;
  readonly searchTerm: Signal<string>;
  readonly listbox: ListboxState<OptionState>;

  readonly id = computed(() => `${counter++}`);
  readonly setsize = computed(() => this.listbox.items().length);
  readonly posinset = computed(() =>
    this.listbox.items().findIndex((item) => item.id() === this.id())
  );
  readonly focused = computed(
    () => this.listbox.focusIndex() === this.posinset()
  );
  readonly active = computed(
    () => this.listbox.activeIndex() === this.posinset()
  );
  readonly selected = computed(() =>
    this.listbox.selectedIndices().includes(this.posinset())
  );
  readonly tabindex = computed(() => (this.focused() ? 0 : -1));

  constructor(inputs: OptionInputs) {
    this.listbox = inputs.listbox;
    this.disabled = inputs.disabled;
    this.searchTerm = inputs.searchTerm;
  }
}
