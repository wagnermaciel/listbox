import { Component, inject } from '@angular/core';
import { Grid } from '../../ng-aria/headless/grid.directive';
import { GridCell } from '../../ng-aria/headless/gridcell.directive';
import { Row } from '../../ng-aria/headless/row.directive';
import { Widget } from '../../ng-aria/headless/widget.directive';
import { StatesService } from '../states.service';

@Component({
  selector: 'grid-demo',
  standalone: true,
  imports: [Grid, Row, GridCell, Widget],
  templateUrl: 'grid-demo.html',
  styleUrl: 'grid-demo.css',
})
export default class GridDemo {
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
