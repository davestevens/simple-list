import { createList } from "../stores/list";

let currentlySelectedList;

export const updateCurrentlySelectedList = (key: string) => {
  if (key) {
    currentlySelectedList = createList(key);
  } else {
    currentlySelectedList = null;
  }
}

export const getCurrentlySelectedList = () => {
  return currentlySelectedList;
}
