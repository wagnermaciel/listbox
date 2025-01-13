import { Directive, effect, ElementRef, inject, model } from '@angular/core';
import { WidgetState } from '../../primitives/composables/grid/widget';
import { Grid } from './grid.directive';
import { GridCell } from './gridcell.directive';

@Directive({
  selector: '[widget]',
  host: {
    '[attr.id]': 'state.id()',
    '[attr.aria-disabled]': 'state.disabled()',
    '[tabindex]': 'state.tabindex()',
    '[class]': 'state.class()',
  },
})
export class Widget {
  readonly state: WidgetState;
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly grid = inject(Grid).state;
  readonly cell = inject(GridCell).state;

  readonly disabled = model<boolean>(false);
  readonly editable = model<boolean>(false);
  readonly usesArrowKeys = model<boolean>(false);

  constructor() {
    let isInitialLoad = true;
    this.state = new WidgetState(this);

    effect(() => {
      if (this.state.focused() && !isInitialLoad) {
        this.element.focus();
      }

      if (this.state.active() && !isInitialLoad) {
        this.element.scrollIntoView({
          block: 'nearest',
        });
      }

      isInitialLoad = false;
    });
  }
}
