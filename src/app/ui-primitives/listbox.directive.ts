import { computed, contentChildren, Directive, model } from '@angular/core';
import { Option } from './option.directive';
import { getListboxProps } from '../composables/listbox/listbox';

@Directive({
  selector: '[listbox]',
  exportAs: 'listbox',
  standalone: true,
  host: {
    role: 'listbox',
    '[attr.tabindex]': 'composable.tabindex()',
    '[attr.aria-orientation]': 'composable.orientation()',
    '[attr.aria-multiselectable]': 'composable.multiselectable()',
    '[attr.aria-activedescendant]': 'composable.activedescendant()',
    '(keydown)': 'composable.onKeyDown($event)',
    '(pointerdown)': 'composable.onPointerDown($event)',
  },
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
  items = computed(() => this.children().map((c) => c.composable));

  composable = getListboxProps(this);
}
