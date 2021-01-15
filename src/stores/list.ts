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
    addActivity: (label: string, info: string): void => {
      update((current) => {
        return [...current, { label, info, color: randomColor() }];
      });
    },
    removeActivity: (index: number): void => {
      update((current) => current.filter((_, i) => i !== index));
    },
  };
};

export const list = createList();
