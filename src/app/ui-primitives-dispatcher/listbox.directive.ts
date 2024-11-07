import { computed, contentChildren, Directive, model } from '@angular/core';
import { EventDispatcher } from '../composables-dispatcher/event-dispatcher';
import { ListboxState } from '../composables-dispatcher/listbox/listbox-state';
import { OptionState } from '../composables-dispatcher/option/option-state';
import { Option } from './option.directive';

@Directive({
  selector: '[listbox]',
  exportAs: 'listbox',
  standalone: true,
  host: {
    role: 'listbox',
    '[attr.tabindex]': 'state.tabindex()',
    '[attr.aria-orientation]': 'state.orientation()',
    '[attr.aria-multiselectable]': 'state.multiselectable()',
    '[attr.aria-activedescendant]': 'state.activedescendant()',
    '(keydown)': 'keydownEvents.dispatch($event)',
    '(pointerdown)': 'pointerdownEvents.dispatch($event)',
  },
})
export class Listbox {
  wrap = model.required<boolean>();
  orientation = model.required<'horizontal' | 'vertical'>();
  followFocus = model.required<boolean>();
  rovingFocus = model.required<boolean>();
  skipDisabled = model.required<boolean>();
  multiselectable = model.required<boolean>();
  keydownEvents = new EventDispatcher<KeyboardEvent>();
  pointerdownEvents = new EventDispatcher<PointerEvent>();

  // This is a demonstration of how we can rename properties
  // if their meaning becomes unclear after being forwarded.

  typeaheadDelay = model.required<number>();
  typeaheadMatcher = model.required<RegExp>();

  delay = this.typeaheadDelay;
  matcher = this.typeaheadMatcher;

  currentIndex = model.required<number>();
  selectedIndices = model.required<number[]>();

  children = contentChildren(Option);
  items = computed(() => this.children().map((c) => c.state));

  state: ListboxState<OptionState>;

  constructor() {
    this.state = new ListboxState(this);
  }
}
