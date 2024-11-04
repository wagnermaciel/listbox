import { computed, contentChildren, Directive, model } from '@angular/core';
import { getListboxProps } from '../../composables/listbox/listbox';
import { Option } from '../option/option.directive';

@Directive({
  selector: '[listbox]',
  exportAs: 'listbox',
  standalone: true,
  host: {
    'role': 'listbox',
    '[attr.tabindex]': 'props.tabindex()',
    '[attr.aria-orientation]': 'props.orientation()',
    '[attr.aria-multiselectable]': 'props.multiselectable()',
    '[attr.aria-activedescendant]': 'props.activedescendant()',
    '(keydown)': 'props.onKeyDown($event)',
    '(pointerdown)': 'props.onPointerDown($event)',
  }
})
export class Listbox {
  wrap = model.required<boolean>();
  vertical = model.required<boolean>();
  followFocus = model.required<boolean>();
  rovingFocus = model.required<boolean>();
  skipDisabled = model.required<boolean>();
  multiselectable = model.required<boolean>();

  // This is a demonstration of how we can rename properties
  // if their meaning becomes unclear after being forwarded.

  typeaheadDelay = model.required<number>();
  typeaheadMatcher = model.required<RegExp>();

  delay = this.typeaheadDelay;
  matcher = this.typeaheadMatcher;

  currentIndex = model.required<number>();
  selectedIndices = model.required<number[]>();

  children = contentChildren(Option);
  items = computed(() => this.children().map(c => c.props));

  props = getListboxProps(this);
}
