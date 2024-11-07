export class EventDispatcher<T extends Event> {
  private readonly listeners = new Set<(event: T) => void | boolean>();

  listen(listener: (event: T) => void | boolean) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  dispatch(event: T) {
    for (const listener of this.listeners) {
      if (listener(event)) {
        break;
      }
    }
  }
}
