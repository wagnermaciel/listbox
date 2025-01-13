import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  model,
} from '@angular/core';
import { GridCellState } from '../../primitives/composables/grid/gridcell';
import { Grid } from './grid.directive';
import { Widget } from './widget.directive';

@Directive({
  selector: '[gridcell]',
  exportAs: 'gridcell',
  host: {
    role: 'gridcell',
    '[attr.id]': 'state.id()',
    '[attr.rowspan]': 'state.rowspan()',
    '[attr.colspan]': 'state.colspan()',
    '[attr.aria-rowspan]': 'state.rowspan()',
    '[attr.aria-colspan]': 'state.colspan()',
    '[attr.aria-rowindex]': 'state.rowindex()',
    '[attr.aria-colindex]': 'state.colindex()',
    '[attr.aria-disabled]': 'state.disabled()',
    '[tabindex]': 'state.tabindex()',
  },
})
export class GridCell {
  readonly wrap = model<boolean>(true);
  readonly rowspan = model<number>(1);
  readonly colspan = model<number>(1);
  readonly disabled = model<boolean>(false);
  readonly widgetIndex = model<number>(-1);

  readonly state: GridCellState;
  readonly grid = inject(Grid).state;
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly children = contentChildren(Widget, { descendants: true });
  readonly widgets = computed(() => this.children().map((c) => c.state));

  constructor() {
    this.state = new GridCellState(this);

    effect(() => {
      if (this.state.focused()) {
        this.element.focus();
      }

      if (this.state.active()) {
        this.element.scrollIntoView({
          block: 'nearest',
        });
      }
    });
  }
}
