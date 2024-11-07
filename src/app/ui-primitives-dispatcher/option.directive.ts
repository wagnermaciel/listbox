import { Directive, effect, ElementRef, inject, model } from '@angular/core';
import { OptionState } from '../composables-dispatcher/option/option-state';
import { Listbox } from './listbox.directive';

@Directive({
  selector: '[option]',
  exportAs: 'option',
  standalone: true,
  host: {
    role: 'option',
    '[attr.id]': 'state.id()',
    '[attr.tabindex]': 'state.tabindex()',
    '[attr.aria-setsize]': 'state.setsize()',
    '[attr.aria-posinset]': 'state.posinset()',
    '[attr.aria-selected]': 'state.selected()',
    '[attr.aria-disabled]': 'state.disabled()',
    '[class.active]': 'state.active()',
    '[class.focused]': 'state.focused()',
  },
})
export class Option {
  searchTerm = model.required<string>();
  disabled = model<boolean>(false);
  listbox = inject(Listbox).state;

  hostEl = inject(ElementRef).nativeElement;
  state: OptionState;

  constructor() {
    this.state = new OptionState(this);
    effect(() => {
      if (this.state.focused()) {
        this.hostEl.focus();
      }
      if (this.state.active()) {
        this.hostEl.scrollIntoView({
          block: 'nearest',
        });
      }
    });
  }
}
