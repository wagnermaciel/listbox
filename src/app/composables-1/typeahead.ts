import { Signal, signal, WritableSignal } from "@angular/core";

interface Item {
  searchTerm: Signal<string>;
}

export class TypeAheadComposable<T extends Item> {
  timeout: any;
  query = signal('');

  constructor(
    public items: Signal<T[]>,
    public delay: Signal<number>,
    public matcher: Signal<RegExp>,
    public currentIndex: WritableSignal<number>,
  ) {}

  search(char: string) {
    if (!this.isValid(char)) {
      return;
    }

    clearTimeout(this.timeout);

    this.query.update(str => str + char.toLowerCase());
    const startIndex = this.query().length === 1 ? this.currentIndex() + 1 : this.currentIndex();
    const index = findIndexFrom(this.items(), i => i.searchTerm().toLowerCase().startsWith(this.query()), startIndex);

    if (index !== -1) {
      this.currentIndex.set(index);
    }

    this.timeout = setTimeout(() => {
      this.query.set('');
    }, this.delay());
  }

  private isValid(char: string): boolean {
    if (char.length !== 1) {
      return false;
    }
  
    if (this.query().length > 0 && char === ' ') {
      return true;
    }
  
    if (/[a-zA-z0-9]/.test(char)) {
      return true;
    }
  
    if (this.matcher().test(char)) {
      return true;
    }
  
    return false;
  }
}

function findIndexFrom<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => unknown, startIndex = 0): number {
  for (let i = startIndex; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  for (let i = 0; i < startIndex; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}
