import { Component, inject } from '@angular/core';
import { StatesService } from './states.service';
import { Grid } from './ui-primitives-2/grid.directive';
import { Row } from './ui-primitives-2/row.directive';
import { GridCell } from './ui-primitives-2/gridcell.directive';
import { Widget } from './ui-primitives-2/widget.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Grid, Row, GridCell, Widget],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  service = inject(StatesService);
  states = this.service.getStates();

  wrap = true;
  vertical = true;
  rovingFocus = false;
  followFocus = true;
  skipDisabled = true;
  multiselectable = false;
  currentIndex = 0;
  typeaheadDelay = 600;
  selectedIndices = [0];
  typeaheadMatcher = /@/;
}
