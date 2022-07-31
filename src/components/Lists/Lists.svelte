<script lang="ts">
  import { onDestroy } from "svelte";
  import type { IList } from "../../types";
  import { listsStore } from "../../stores/listsStore";
  import SMUIList, {
    Item,
    Text,
    PrimaryText,
    SecondaryText,
  } from '@smui/list';
  import List from "./List.svelte";

  let lists: IList[];

  const unsubscribe = listsStore.subscribe((value) => {
    lists = value;
  });

  onDestroy(unsubscribe);
</script>

<template>
  <SMUIList
    twoLine
  >
    {#each lists as list, index}
      <List {...list} {index} />
    {:else}
    <Item>
      <Text>
        <PrimaryText>Nothing here</PrimaryText>
        <SecondaryText></SecondaryText>
      </Text>
    </Item>
    {/each}
  </SMUIList>
</template>
