import { signal } from "@angular/core";
import { TypeAheadInputs, TypeAheadItem, TypeAheadProps } from "./typeahead.types";

export function getTypeAheadProps<T extends TypeAheadItem>(args: TypeAheadInputs<T>): TypeAheadProps<T> {
  let timeout: any;
  const query = signal('');

  return {
    ...args,
    query,
    search: (char: string) => {
      if (!isValid(query(), args.matcher(), char)) {
        return;
      }

      clearTimeout(timeout);

      query.update(str => str + char.toLowerCase());
      const startIndex = query().length === 1 ? args.currentIndex() + 1 : args.currentIndex();
      const index = findIndexFrom(args.items(), i => i.searchTerm().toLowerCase().startsWith(query()), startIndex);

      if (index !== -1) {
        args.currentIndex.set(index);
      }

      timeout = setTimeout(() => {
        query.set('');
      }, args.delay());
    }
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

function isValid(searchString: string, matcher: RegExp, char: string): boolean {
  if (char.length !== 1) {
    return false;
  }

  if (searchString.length > 0 && char === ' ') {
    return true;
  }

  if (/[a-zA-z0-9]/.test(char)) {
    return true;
  }

  if (matcher.test(char)) {
    return true;
  }

  return false;
}
