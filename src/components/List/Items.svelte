<script lang="ts">
  import { onDestroy } from "svelte";
  import List, {
    Item as SMUIItem,
    Text,
    PrimaryText,
    SecondaryText,
  } from '@smui/list';
  import type { IListItem } from "../../types";
  import { getCurrentlySelectedList } from "../../services/currentlySelectedList";
  import Item from "./Item.svelte";

  let items: IListItem[];

  const unsubscribe = getCurrentlySelectedList().subscribe((value) => {
    items = value;
  });

  onDestroy(unsubscribe);
</script>

<template>
  <List
    twoLine
    avatarList
    singleSelection
  >
    {#each items as item, index}
      <Item {...item} {index} />
    {:else}
    <SMUIItem>
      <Text>
        <PrimaryText>Nothing here</PrimaryText>
        <SecondaryText></SecondaryText>
      </Text>
    </SMUIItem>
    {/each}
  </List>
</template>
