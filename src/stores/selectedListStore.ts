import { writable } from 'svelte/store';
import { SELECTED_LIST_KEY } from '../consts';
import type { ISelectedList } from '../types';

export const createSelectedListStore = () => {
  const initialValue = JSON.parse(localStorage.getItem(SELECTED_LIST_KEY)) as ISelectedList || null;
  const { update, subscribe } = writable<ISelectedList | null>(initialValue);

  subscribe((val) => {
    localStorage.setItem(SELECTED_LIST_KEY, JSON.stringify(val));
  });

  return {
    subscribe,
    select: (key: string, label: string): void => {
      update(() => ({ key, label }));
    },
    clear: (): void => {
      update(() => null);
    },
  };
};

export const selectedListStore = createSelectedListStore();
