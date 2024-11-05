import { NavigationComposable } from '../navigation/navigation';
import { SelectionComposable } from '../selection/selection';
import { FocusComposable } from '../focus/focus';
import { computed, Signal } from '@angular/core';
import { TypeAheadComposable } from '../typeahead/typeahead';
import { OptionComposable } from '../option/option';
import { ListboxInputs, ListboxComposableInterface } from './listbox.types';

export class ListboxComposable<T extends OptionComposable> implements ListboxComposableInterface<T> {
  focusManager: FocusComposable<T>;
  typeaheadManager: TypeAheadComposable<T>;
  selectionManager: SelectionComposable<T>;
  navigationManager: NavigationComposable<T>;

  orientation = computed(() => this.vertical() ? 'vertical' : 'horizontal');

  tabindex: Signal<number>;
  vertical: Signal<boolean>;
  multiselectable: Signal<boolean>;
  activedescendant: Signal<string>;

  constructor(args: ListboxInputs<T>) {
    this.focusManager = new FocusComposable({ ...args });
    this.typeaheadManager = new TypeAheadComposable({ ...args });
    this.selectionManager = new SelectionComposable({ ...args });
    this.navigationManager = new NavigationComposable({ ...args });

    this.vertical = args.vertical;
    this.tabindex = this.focusManager.tabindex;
    this.multiselectable = args.multiselectable;
    this.activedescendant = this.focusManager.activedescendant;
  }

  onKeyDown(event: KeyboardEvent) {
    this.handleNavigation(event);
    if (this.selectionManager.multiselectable()) {
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
        const index = this.navigationManager.items().findIndex(i => i.id() === li.id);
        this.navigationManager.navigateTo(index);
        this.selectionManager.multiselectable() ? this.selectionManager.toggle() : this.selectionManager.select();
      }
    }
  }
}
