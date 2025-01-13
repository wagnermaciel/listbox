import { computed, Signal, WritableSignal } from '@angular/core';
import { FocusState } from '../focus/focus.state';
import { NavigationState } from '../navigation/navigation';
import { GridState, RowCol } from './grid';
import { WidgetState } from './widget';

export interface GridCellInputs {
  readonly element: HTMLElement;
  readonly grid: GridState;
  readonly wrap: Signal<boolean>;
  readonly rowspan: Signal<number>;
  readonly colspan: Signal<number>;
  readonly disabled: Signal<boolean>;
  readonly widgets: Signal<WidgetState[]>;
  readonly widgetIndex: WritableSignal<number>;
}

let counter = -1;

export class GridCellState {
  readonly grid: GridState;
  readonly wrap: Signal<boolean>;
  readonly rowspan: Signal<number>;
  readonly colspan: Signal<number>;
  readonly disabled: Signal<boolean>;
  readonly widgets: Signal<WidgetState[]>;
  readonly widgetIndex: WritableSignal<number>;

  readonly focusState: FocusState<WidgetState>;
  readonly navigationState: NavigationState<WidgetState>;

  readonly id = computed(() => `gridcell-${counter++}`);
  readonly index = computed(() => getIndex(this.grid.cells(), this.id()));
  readonly rowindex = computed(() => this.index().rowindex);
  readonly colindex = computed(() => this.index().colindex);
  readonly tabindex = computed(() => (this.focused() ? 0 : -1));

  readonly inWidgetMode = computed(
    () => this.autofocusWidget() || this.widgetIndex() !== -1,
  );

  readonly autofocusWidget = computed(() => {
    const widget = this.widgets().at(0);

    return (
      this.widgets().length === 1 &&
      !widget!.usesArrowKeys() &&
      !widget!.editable()
    );
  });

  readonly hasNavigation = computed(() => this.widgets().length > 1);
  readonly isCurrent = computed(() => this.grid.currentCell() === this);

  readonly active = computed(() => {
    return (
      !this.autofocusWidget() &&
      this.widgetIndex() === -1 &&
      this.grid.activeCell() === this
    );
  });

  readonly focused = computed(() => {
    return (
      !this.autofocusWidget() &&
      this.widgetIndex() === -1 &&
      this.grid.focusedCell() === this
    );
  });

  constructor(inputs: GridCellInputs) {
    this.grid = inputs.grid;
    this.wrap = inputs.wrap;
    this.rowspan = inputs.rowspan;
    this.colspan = inputs.colspan;
    this.widgets = inputs.widgets;
    this.disabled = inputs.disabled;
    this.widgetIndex = inputs.widgetIndex;

    this.focusState = new FocusState({
      ...inputs,
      items: this.widgets,
      currentIndex: this.widgetIndex,
      rovingFocus: this.grid.rovingFocus,
    });

    this.navigationState = new NavigationState({
      ...inputs,
      items: this.widgets,
      currentIndex: this.widgetIndex,
      skipDisabled: this.grid.skipDisabled,
    });
  }

  load() {
    this.navigationState.getController();
  }

  navigateNext() {
    this.navigationState.navigateNext();
  }

  navigatePrev() {
    this.navigationState.navigatePrev();
  }

  navigateTo(index: number) {
    this.navigationState.navigateTo(index);
  }
}

function getIndex(grid: GridCellState[][], id: string): RowCol {
  const takenCells: RowCol[] = [];

  const getNextCol = (row: number, col: number) => {
    for (let i = 0; i < takenCells.length; i++) {
      if (takenCells[i].rowindex === row && takenCells[i].colindex === col) {
        col++;
        takenCells.slice(i--, 1);
      }
    }
    return col;
  };

  const markCellsAsTaken = (cell: GridCellState) => {
    for (
      let i = cell.rowindex() + 1;
      i < cell.rowindex() + cell.rowspan();
      i++
    ) {
      for (let j = cell.colindex(); j < cell.colindex() + cell.colspan(); j++) {
        takenCells.push({ rowindex: i, colindex: j });
      }
    }
  };

  let rowindex = 0;
  let colindex = 0;

  for (; rowindex < grid.length; rowindex++) {
    colindex = 0;
    const row = grid[rowindex];

    for (const cell of row) {
      colindex = getNextCol(rowindex, colindex);

      if (cell.id() === id) {
        return { rowindex: rowindex, colindex: colindex };
      }

      colindex += cell.colspan();

      if (cell.rowspan() > 1) {
        markCellsAsTaken(cell);
      }
    }
  }

  return { rowindex: 0, colindex: 0 };
}
