import { Directive, effect, ElementRef, inject, model } from '@angular/core';
import { Listbox } from './listbox.directive';
import { OptionComposable } from '../composables-1/option';

@Directive({
  selector: '[option]',
  exportAs: 'option',
  standalone: true,
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
  composable: OptionComposable;

  constructor() {
    this.composable = new OptionComposable(
      this.listbox,
      this.disabled,
      this.searchTerm
    );

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
