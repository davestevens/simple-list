import { writable } from "svelte/store";
import { LIST_KEY } from "../consts";
import type { IListItem } from "../types";
import randomColor from "../services/randomColor";

const createList = () => {
  const initialValue = JSON.parse(localStorage.getItem(LIST_KEY)) || [];
  const { update, subscribe } = writable<IListItem[]>(initialValue);

  subscribe((val) => {
    localStorage.setItem(LIST_KEY, JSON.stringify(val));
  });

  return {
    subscribe,
    addItem: (label: string, info: string): void => {
      update((current) => {
        return [...current, { label: label.trim(), info, color: randomColor() }];
      });
    },
    getItem: (index: number): IListItem => {
      let $current: IListItem[];
      subscribe($ => $current = $)();
      return $current.find((_, i) => i === index);
    },
    updateItem: (index: number, label: string, info: string): void => {
      update((current) => {
        const item = current.find((_, i) => i === index);
        item.label = label;
        item.info = info;
        return [...current];
      });
    },
    removeItem: (index: number): void => {
      update((current) => current.filter((_, i) => i !== index));
    },
  };
};

export const list = createList();
