<script lang="ts">
  import { onDestroy } from "svelte";
  import Items from "../components/List/Items.svelte";
  import AddItemButton from "../components/List/AddItemButton.svelte";
  import BottomBar from "../components/BottomBar.svelte";
  import ClearCurrentlySelectedListButton from "../components/List/ClearCurrentlySelectedListButton.svelte";
  import { selectedListStore } from "../stores/selectedListStore";
  import { listsStore } from "../stores/listsStore";

  let listLabel: string;

  const unsubscribe = selectedListStore.subscribe((value) => {
    const list = listsStore.getListByKey(value);
    listLabel = list?.label;
  });

  onDestroy(unsubscribe);
</script>

<template>
  <Items />
  <BottomBar>
    <ClearCurrentlySelectedListButton />
    <h3>{listLabel}</h3>
    <AddItemButton />
  </BottomBar>
</template>
