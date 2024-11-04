import { Directive, effect, ElementRef, inject, model } from '@angular/core';
import { getOptionProps } from '../../composables/option/option';
import { Listbox } from '../listbox/listbox.directive';

@Directive({
  selector: '[option]',
  exportAs: 'option',
  standalone: true,
  host: {
    'role': 'option',
    '[attr.id]': 'props.id()',
    '[attr.tabindex]': 'props.tabindex()',
    '[attr.aria-setsize]': 'props.setsize()',
    '[attr.aria-posinset]': 'props.posinset()',
    '[attr.aria-selected]': 'props.selected()',
    '[attr.aria-disabled]': 'props.disabled()',
    '[class.active]': 'props.active()',
    '[class.focused]': 'props.focused()',
  }
})
export class Option {
  searchTerm = model.required<string>();
  disabled = model<boolean>(false);
  listbox = inject(Listbox).props;
  props = getOptionProps(this);

  hostEl = inject(ElementRef).nativeElement;

  constructor() {
    effect(() => {
      if (this.props.focused()) {
        this.hostEl.focus();
      }
      if (this.props.active()) {
        this.hostEl.scrollIntoView({
          block: 'nearest',
        });
      }
    })
  }
}
