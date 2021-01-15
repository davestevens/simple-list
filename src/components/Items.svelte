<script lang="ts">
  import { onDestroy } from "svelte";
  import type { IListItem } from "../types";
  import { list } from "../stores/list";
  import Item from "./Item.svelte";

  let items: IListItem[];

  const unsubscribe = list.subscribe((value) => {
    items = value;
  });

  onDestroy(unsubscribe);
</script>

<style>
  ul {
    max-width: 40rem;
    list-style: none;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
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
