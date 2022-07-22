import { writable } from "svelte/store";
import { SELECTED_LIST_KEY } from "../consts";

const createSelectedListStore = () => {
  const initialValue = JSON.parse(localStorage.getItem(SELECTED_LIST_KEY)) || null;
  const { update, subscribe } = writable<string | null>(initialValue);

  subscribe((val) => {
    localStorage.setItem(SELECTED_LIST_KEY, JSON.stringify(val));
  });

  return {
    subscribe,
    select: (key: string): void => {
      update(() => key);
    },
    clear: (): void => {
      update(() => null);
    }
  };
};

export const selectedListStore = createSelectedListStore();
