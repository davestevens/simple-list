import { createList } from '../stores/list';
import type { ICreateList } from '../types';

let currentlySelectedList: ICreateList | null;

export const updateCurrentlySelectedList = (key: string) => {
  if (key) {
    currentlySelectedList = createList(key);
  } else {
    currentlySelectedList = null;
  }
};

export const getCurrentlySelectedList = (): ICreateList | null => currentlySelectedList;
