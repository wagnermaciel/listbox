import { computed, Signal, WritableSignal } from '@angular/core';
import { OptionComposable } from './option';
import { FocusComposable } from './focus';
import { TypeAheadComposable } from './typeahead';
import { SelectionComposable } from './selection';
import { NavigationComposable } from './navigation';

export class ListboxComposable<T extends OptionComposable> {
  focusManager: FocusComposable<T>;
  typeaheadManager: TypeAheadComposable<T>;
  selectionManager: SelectionComposable<T>;
  navigationManager: NavigationComposable<T>;

  orientation = computed(() => this.vertical() ? 'vertical' : 'horizontal');
  tabindex: Signal<number>;
  activedescendant: Signal<string>;

  constructor(
    public vertical: Signal<boolean>,
    public items: Signal<T[]>,
    public rovingFocus: Signal<boolean>,
    public currentIndex: WritableSignal<number>,
    public delay: Signal<number>,
    public matcher: Signal<RegExp>,
    public followFocus: Signal<boolean>,
    public multiselectable: Signal<boolean>,
    public selectedIndices: WritableSignal<number[]>,
    public wrap: Signal<boolean>,
    public skipDisabled: Signal<boolean>,
  ) {
    this.focusManager = new FocusComposable(this.items, this.rovingFocus, this.currentIndex);
    this.typeaheadManager = new TypeAheadComposable(this.items, this.delay, this.matcher, this.currentIndex);
    this.selectionManager = new SelectionComposable(this.items, this.followFocus, this.multiselectable, this.currentIndex, this.selectedIndices);
    this.navigationManager = new NavigationComposable(this.wrap, this.items, this.skipDisabled, this.currentIndex);

    this.tabindex = this.focusManager.tabindex;
    this.activedescendant = this.focusManager.activedescendant;
  }

  onKeyDown(event: KeyboardEvent) {
    this.handleNavigation(event);
    if (this.multiselectable()) {
      this.handleMultiSelection(event);
    } else {
      this.handleSingleSelection(event);
    }
  }
  
  handleNavigation(event: KeyboardEvent) {
    const upOrLeft = this.vertical() ? 'ArrowUp' : 'ArrowLeft';
    const downOrRight = this.vertical() ? 'ArrowDown' : 'ArrowRight';
  
    if (
      event.key === ' ' ||
      event.key === downOrRight ||
      event.key === upOrLeft
    ) {
      event.preventDefault();
    }
  
    switch (event.key) {
      case downOrRight:
        this.navigationManager.navigateNext();
        break;
      case upOrLeft:
        this.navigationManager.navigatePrev();
        break;
      case 'Home':
        this.navigationManager.navigateFirst();
        break;
      case 'End':
        this.navigationManager.navigateLast();
        break;
    }
  
    this.typeaheadManager.search(event.key);
  }
  
  handleSingleSelection(event: KeyboardEvent) {
    if (this.selectionManager.followFocus()) {
      this.selectionManager.select();
      return;
    }
  
    if (event.key === ' ') {
      this.selectionManager.toggle();
    }
  }
  
  handleMultiSelection(event: KeyboardEvent) {
    const upOrLeft = this.vertical() ? 'ArrowUp' : 'ArrowLeft';
    const downOrRight = this.vertical() ? 'ArrowDown' : 'ArrowRight';
  
    if (event.ctrlKey) {
      if (event.key === 'a') {
        this.selectionManager.toggleAll();
        return;
      }
    }
  
    if (event.ctrlKey && event.shiftKey) {
      if (event.key === 'Home' || event.key === 'End') {
        this.selectionManager.selectFromAnchor();
        return;
      }
    }
  
    if (event.shiftKey) {
      if (event.key === ' ') {
        this.selectionManager.selectFromAnchor();
        return;
      } else if (event.key === downOrRight || event.key === upOrLeft) {
        this.selectionManager.toggle();
        return;
      }
    }
  
    if (event.key === ' ') {
      this.selectionManager.toggle();
    }
  }

  onPointerDown(event: PointerEvent) {
    if (event.target instanceof HTMLElement) {
      const li = event.target.closest('li');
  
      if (li) {
        const index = this.items().findIndex(i => i.id() === li.id);
        this.navigationManager.navigateTo(index);
        this.multiselectable() ? this.selectionManager.toggle() : this.selectionManager.select();
      }
    }
  }
}
