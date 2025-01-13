import {
  computed,
  ElementRef,
  inject,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ListboxState } from '../listbox/listbox';

export interface OptionInputs {
  readonly selected: WritableSignal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly searchTerm: Signal<string>;
  readonly listbox: ListboxState<OptionState>;
}

let counter = -1;

export class OptionState {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly selected: WritableSignal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly searchTerm: Signal<string>;
  readonly listbox: ListboxState<OptionState>;

  readonly id = computed(() => `${counter++}`);
  readonly setsize = computed(
    () => this.listbox.navigationState.items().length,
  );
  readonly posinset = computed(() =>
    this.listbox.navigationState
      .items()
      .findIndex((item) => item.id() === this.id()),
  );
  readonly focused = computed(
    () => this.listbox.focusState.focusIndex() === this.posinset(),
  );
  readonly active = computed(
    () => this.listbox.focusState.activeIndex() === this.posinset(),
  );
  readonly tabindex = computed(() => (this.focused() ? 0 : -1));

  constructor(args: OptionInputs) {
    this.listbox = args.listbox;
    this.selected = args.selected;
    this.disabled = args.disabled;
    this.searchTerm = args.searchTerm;
  }
}
