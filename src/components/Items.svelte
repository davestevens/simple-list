<script lang="ts">
  import { onDestroy, onMount, setContext } from "svelte";
  import type { IListItem } from "../types";
  import { list } from "../stores/list";
  import Item from "./Item.svelte";

  let items: IListItem[];
  let isInitialized = false;

  const unsubscribe = list.subscribe((value) => {
    items = value;
  });

  setContext("items", {
    isInitialized: () => isInitialized,
  });

  onMount(() => {
    isInitialized = true;
  });

  onDestroy(unsubscribe);
</script>

<style>
  ul {
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
  }

  .empty {
    text-align: center;
    margin: 1rem 0;
  }
</style>

<ul>
  {#each items as item, index}
    <Item {...item} {index} />
  {:else}
    <li class="empty">Nothing here</li>
  {/each}
</ul>
