import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatesService } from './states.service';
import { Listbox } from './ui-primitives-dispatcher/listbox.directive';
import { Option } from './ui-primitives-dispatcher/option.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, Listbox, Option, TitleCasePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ui-primitives';
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
