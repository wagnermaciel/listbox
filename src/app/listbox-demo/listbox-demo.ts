import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import { Listbox } from '../../ng-aria/headless/listbox.directive';
import { Option } from '../../ng-aria/headless/option.directive';
import { DemoControls } from '../demo-controls/demo-controls';

let nextId = 10;

@Component({
  selector: 'listbox-demo',
  standalone: true,
  templateUrl: 'listbox-demo.html',
  styleUrl: 'listbox-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Listbox, Option, DemoControls],
})
export default class ListboxDemo {
  items = signal(Array.from({ length: nextId }, (_, i) => i));

  disabled = signal(false);
  disabledItems = signal(new Set<number>(), { equal: () => false });
  focusStrategy = signal('rovingtabindex');
  orientation = signal('vertical');
  selectionType = signal('single');
  selectionStrategy = signal('followfocus');
  wrapNavigation = signal(false);
  typeaheadMatcher = signal(/[a-z0-9]/i);
  currentIndex = signal(0);

  listbox = viewChild.required(Listbox);
  controls = viewChild.required(DemoControls);

  commandTarget = computed<number | 'l' | undefined>(() =>
    this.getTarget(this.controls().command()),
  );

  commands = [
    {
      name: 'f',
      description: 'Toggle focus management strategy',
      current: this.focusStrategy,
      match: /^f$/,
      run: () => {
        this.focusStrategy.update((s) =>
          s === 'activedescendant' ? 'rovingtabindex' : 'activedescendant',
        );
      },
    },
    {
      name: 'o',
      description: 'Toggle the orientation of the listbox',
      current: this.orientation,
      match: /^o$/,
      run: () => {
        this.orientation.update((o) =>
          o === 'vertical' ? 'horizontal' : 'vertical',
        );
      },
    },
    {
      name: 'm',
      description: 'Toggle selection type',
      current: this.selectionType,
      match: /^m$/,
      run: () => {
        this.selectionType.update((t) =>
          t === 'single' ? 'multiple' : 'single',
        );
      },
    },
    {
      name: 's',
      description: 'Toggle selection strategy',
      current: this.selectionStrategy,
      match: /^s$/,
      run: () => {
        this.selectionStrategy.update((s) =>
          s === 'followfocus' ? 'explicit' : 'followfocus',
        );
      },
    },
    {
      name: 'w',
      description: 'Toggle wrap navigation',
      current: computed(() => (this.wrapNavigation() ? 'yes' : 'no')),
      match: /^w$/,
      run: () => {
        this.wrapNavigation.update((w) => !w);
      },
    },
    {
      name: '[l, a, <index>]',
      description:
        'Prefix to target command at list, active item, or item at given index',
      match: () => false,
      run: () => {},
    },
    {
      name: '<target>d',
      description: 'Toggle disabled state of the target element',
      match: /^(l|a|\d+)d$/i,
      run: () => {
        const target = this.commandTarget();
        if (target === 'l') {
          this.disabled.set(!this.disabled());
          return;
        } else if (typeof target === 'number') {
          const item = this.items()[target];
          if (this.disabledItems().has(item)) {
            this.disabledItems().delete(item);
          } else {
            this.disabledItems().add(item);
          }
          this.disabledItems.update((s) => s);
        }
      },
    },
    {
      name: '<target>a',
      description: 'Add an item before the target item',
      match: /^(l|a|\d+)a$/i,
      run: () => {
        const target = this.commandTarget();
        if (typeof target !== 'number') {
          return;
        }
        this.items.update((items) => [
          ...items.slice(0, target),
          nextId++,
          ...items.slice(target),
        ]);
      },
    },
    {
      name: '<target>r',
      description: 'Remove the target item',
      match: /^(l|a|\d+)r$/i,
      run: () => {
        const target = this.commandTarget();
        if (typeof target !== 'number') {
          return;
        }
        this.items().splice(target, 1);
        this.items.update((items) => items);
      },
    },
  ];

  private getTarget(command: string) {
    const match = command.match(/^(l|a|\d+)/i);
    if (match?.[0] === 'l') {
      return 'l';
    }
    if (match?.[0] === 'a') {
      return this.currentIndex();
    }
    return match
      ? Math.min(this.items().length - 1, Number(match?.[0]))
      : undefined;
  }
}
