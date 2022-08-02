import type { SvelteComponent } from 'svelte';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export interface IList {
  label: string;
  key: string;
}

export interface IListItem {
  label: string;
  info: string;
  color: string;
}

export interface ISelectedList {
  key: string;
  label: string;
}

export interface ISimpleModalContext {
  open: (NewComponent: typeof SvelteComponent) => void;
  close: () => void;
}

export interface ICreateList {
  subscribe(
    this: void,
    run: Subscriber<IListItem[]>,
    invalidate?: (value?: IListItem[]) => void,
  ): Unsubscriber;
  addItem: (label: string, info: string) => void;
  getItem: (index: number) => IListItem;
  updateItem: (index: number, label: string, info: string) => void;
  removeItem: (index: number) => void;
  getItemCount: () => number;
}
