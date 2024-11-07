import { type ListboxState } from './listbox-state';

export class ListboxController<T extends ListboxState<any>> {
  constructor(private readonly state: T) {}

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      console.log('Up arrow disabled!');
      event.preventDefault();
      return true;
    }
    return false;
  }
}
