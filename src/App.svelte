<script lang="ts">
  import { onDestroy } from "svelte";
  import Modal from "svelte-simple-modal";
  import List from "./views/List.svelte";
  import Lists from "./views/Lists.svelte";
  import { selectedListStore } from "./stores/selectedListStore";
  import { updateCurrentlySelectedList } from "./services/currentlySelectedList";
  import NavBar from "./components/NavBar.svelte";
  import type { ISelectedList } from "./types";

  let selectedList: ISelectedList | null;

  const unsubscribe = selectedListStore.subscribe((value) => {
    updateCurrentlySelectedList(value?.key);
    selectedList = value;
  });

  onDestroy(unsubscribe);
</script>

<style scoped>
  main {
    width: 100vw;
    height: 100vh;
  }

  section {
    padding: 3rem 0 4rem 0;
  }
</style>

<main>
  <Modal>
    <NavBar title={selectedList?.label || "Simple List"} />
    <section>
      {#if selectedList}
        <List />
      {:else}
        <Lists />
      {/if}
    </section>
  </Modal>
</main>
