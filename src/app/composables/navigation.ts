import { computed, Signal, signal, WritableSignal } from "@angular/core";

export interface Item {
  disabled: Signal<boolean>;
}

export interface NavigationInterface<T extends Item> {
  wrap: Signal<boolean>;
  items: Signal<T[]>;
  skipDisabled: Signal<boolean>;
  currentItem: Signal<T | undefined>;
  currentIndex: WritableSignal<number>;
  firstIndex: Signal<number>;
  lastIndex: Signal<number>;

  navigateTo: (i: number) => void;
  navigatePrev: () => void;
  navigateNext: () => void;
  navigateFirst: () => void;
  navigateLast: () => void;
}

export type NavigationInputs<T extends Item> = Pick<NavigationInterface<T>, 'items' | 'wrap' | 'skipDisabled' | 'currentIndex'>;

export function getNavigationProps<T extends Item>(args: NavigationInputs<T>): NavigationInterface<T> {
  const currentItem = computed(() => args.items()[args.currentIndex()]);

  const firstIndex = computed(() => {
    if (!args.skipDisabled()) {
      return 0;
    }
    return args.items().findIndex((i) => !i.disabled()) ?? -1;
  });

  const lastIndex = computed(() => {
    const items = args.items();

    if (!args.skipDisabled()) {
      return items.length - 1;
    }

    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].disabled()) {
        return i;
      }
    }

    return -1;
  });

  const getPrevIndex = (index: number): number => {
    const prevIndex = args.wrap() && index === 0 ? lastIndex() : index - 1;
    return Math.max(prevIndex, firstIndex());
  }

  const getNextIndex = (index: number): number => {
    const nextIndex = args.wrap() && index === lastIndex() ? 0 : index + 1;
    return Math.min(nextIndex, lastIndex());
  }

  const navigate = (navigateFn: (i: number) => number): void => {
    const index = signal(args.currentIndex());
    const isLoop = computed(() => index() === args.currentIndex());
    const shouldSkip = computed(() => args.skipDisabled() && args.items()[index()]?.disabled());
  
    do {
      index.update(navigateFn);
    } while (shouldSkip() && !isLoop());
  
    args.currentIndex.set(index());
  }

  const navigateTo = (index: number): void => {
    if (!args.items()[index]?.disabled()) {
      args.currentIndex.set(index);
    }
  }

  return {
    ...args,
    lastIndex,
    firstIndex,
    currentItem,
  
    navigateTo,
    navigatePrev: () => navigate(getPrevIndex),
    navigateNext: () => navigate(getNextIndex),
    navigateFirst: () => { args.currentIndex.set(firstIndex()) },
    navigateLast: () => { args.currentIndex.set(lastIndex()) },
  }
}
