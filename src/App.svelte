<script lang="ts">
  import { onDestroy } from "svelte";
  import Modal from "svelte-simple-modal";
  import List from "./views/List.svelte";
  import Lists from "./views/Lists.svelte";
  import { selectedListStore } from "./stores/selectedListStore";
  import { updateCurrentlySelectedList } from "./services/currentlySelectedList";

  let selectedList: string | null;

  const unsubscribe = selectedListStore.subscribe((value) => {
    updateCurrentlySelectedList(value);
    selectedList = value;
  });

  onDestroy(unsubscribe);
</script>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>

<main>
  <Modal>
    {#if selectedList}
      <List />
    {:else}
      <Lists />
    {/if}
  </Modal>
</main>
