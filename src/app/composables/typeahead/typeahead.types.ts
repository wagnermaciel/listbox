import { Signal, WritableSignal } from '@angular/core';

export interface TypeAheadItem {
  searchTerm: Signal<string>;
}

export interface TypeAheadProps<T extends TypeAheadItem> {
  items: Signal<T[]>;
  delay: Signal<number>;
  query: Signal<string>;
  matcher: Signal<RegExp>;
  currentIndex: WritableSignal<number>;
  search: (c: string) => void;
}

export type TypeAheadInputs<T extends TypeAheadItem> = Pick<TypeAheadProps<T>, 'items' | 'currentIndex' | 'delay' | 'matcher'>;
