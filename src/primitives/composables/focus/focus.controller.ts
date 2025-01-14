import { GenericEventManager } from '../../events/event-manager';
import { Controller } from '../controller';
import { FocusState, Item } from './focus.state';

export class FocusController implements Controller {
  readonly handlers = {
    focusout: (e: FocusEvent) => this.focusoutManager.handle(e),
  } as const;

  readonly focusoutManager = new GenericEventManager<FocusEvent>().on((e) => {
    // If the active element is blurred due to its imminent removal from the DOM,
    // focus the new active element.
    if (this.state.currentItem()?.element === e.target) {
      Promise.resolve().then(() => {
        if (!this.state.element.contains(e.target as Element)) {
          this.state.currentItem()?.element.focus();
        }
      });
    }
  });

  constructor(private readonly state: FocusState<Item>) {}
}
