import { Directive, effect, ElementRef, inject, model } from '@angular/core';
import { OptionState } from '../../primitives/composables/option/option';
import { Listbox } from './listbox.directive';

@Directive({
  selector: '[option]',
  exportAs: 'option',
  host: {
    role: 'option',
    '[attr.id]': 'composable.id()',
    '[attr.tabindex]': 'composable.tabindex()',
    '[attr.aria-setsize]': 'composable.setsize()',
    '[attr.aria-posinset]': 'composable.posinset()',
    '[attr.aria-selected]': 'composable.selected()',
    '[attr.aria-disabled]': 'composable.disabled()',
    '[class.active]': 'composable.active()',
    '[class.focused]': 'composable.focused()',
  },
})
export class Option {
  searchTerm = model.required<string>();
  disabled = model<boolean>(false);
  listbox = inject(Listbox).composable;

  hostEl = inject(ElementRef).nativeElement;
  composable: OptionState;

  constructor() {
    this.composable = new OptionState(this);
    effect(() => {
      if (this.composable.focused()) {
        this.hostEl.focus();
      }
      if (this.composable.active()) {
        this.hostEl.scrollIntoView({
          block: 'nearest',
        });
      }
    });
  }
}
