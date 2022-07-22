import { writable } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';
import { LISTS_KEY } from "../consts";
import type { IList } from "../types";
import { destroyList } from "./list";

const createListsStore = () => {
  const initialValue = JSON.parse(localStorage.getItem(LISTS_KEY)) || [];
  const { update, subscribe } = writable<IList[]>(initialValue);

  subscribe((val) => {
    localStorage.setItem(LISTS_KEY, JSON.stringify(val));
  });

  return {
    subscribe,
    addItem: (label: string): void => {
      update((current) => {
        return [...current, { label: label.trim(), key: uuidv4() }];
      });
    },
    getList: (index: number): IList => {
      let $current: IList[];
      subscribe($ => $current = $)();
      return $current.find((_, i) => i === index);
    },
    getListByKey: (key: string): IList => {
      let $current: IList[];
      subscribe($ => $current = $)();
      return $current.find((list) => list.key === key);
    },
    updateList: (index: number, label: string): void => {
      update((current) => {
        const list = current.find((_, i) => i === index);
        list.label = label;
        return [...current];
      });
    },
    removeList: (index: number): void => {
      update((current) => {
        const toRemove = current.find((_, i) => i === index);
        destroyList(toRemove.key);
        return current.filter((_, i) => i !== index);
      });
    },
  };
};

export const listsStore = createListsStore();
