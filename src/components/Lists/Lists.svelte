<script lang="ts">
  import { onDestroy, onMount, setContext } from "svelte";
  import type { IList } from "../../types";
  import { listsStore } from "../../stores/listsStore";
  import List from "./List.svelte";

  let lists: IList[];
  let isInitialized = false;

  const unsubscribe = listsStore.subscribe((value) => {
    lists = value;
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
  {#each lists as list, index}
    <List {...list} {index} />
  {:else}
    <li class="empty">Nothing here</li>
  {/each}
</ul>
