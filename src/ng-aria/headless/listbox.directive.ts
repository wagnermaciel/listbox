import {
  computed,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  model,
} from '@angular/core';
import { ListboxState } from '../../primitives/composables/listbox/listbox';
import { OptionState } from '../../primitives/composables/option/option';
import { Option } from './option.directive';

@Directive({
  selector: '[listbox]',
  exportAs: 'listbox',
  host: {
    role: 'listbox',
    '[attr.tabindex]': 'composable.tabindex()',
    '[attr.aria-orientation]': 'composable.orientation()',
    '[attr.aria-multiselectable]': 'composable.multiselectable()',
    '[attr.aria-activedescendant]': 'composable.activedescendant()',
    '(focusin)': 'composable.load()',
    '(mouseenter)': 'composable.load()',
    '(keydown)': 'composable.onKeyDown($event)',
    '(pointerdown)': 'composable.onPointerDown($event)',
    '(focusout)': 'composable.onFocusout($event)',
  },
})
export class Listbox {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly wrap = model.required<boolean>();
  readonly vertical = model.required<boolean>();
  readonly followFocus = model.required<boolean>();
  readonly rovingFocus = model.required<boolean>();
  readonly skipDisabled = model.required<boolean>();
  readonly multiselectable = model.required<boolean>();

  // This is a demonstration of how we can rename properties
  // if their meaning becomes unclear after being forwarded.

  readonly typeaheadDelay = model.required<number>();
  readonly typeaheadMatcher = model.required<RegExp>();

  readonly delay = this.typeaheadDelay;
  readonly matcher = this.typeaheadMatcher;

  readonly currentIndex = model.required<number>();
  readonly selectedIndices = model.required<number[]>();

  readonly children = contentChildren(Option);
  readonly items = computed(() => this.children().map((c) => c.composable));

  readonly composable: ListboxState<OptionState>;

  constructor() {
    this.composable = new ListboxState(this);
  }
}
