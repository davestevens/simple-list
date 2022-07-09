<script lang="ts">
  import Items from "./components/Items.svelte";
  import AddButton from "./components/AddButton.svelte";
  import NewItemModal from "./components/NewItemModal.svelte";
import BottomBar from "./components/BottomBar.svelte";

  let showNewItemModal: boolean = false;

  const handleOpen = () => {
    showNewItemModal = true;
  }

  const handleClose = () => {
    showNewItemModal = false;
  }
</script>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .disabled {
    filter: blur(0.25rem);
    overflow: hidden;
    pointer-events: none;
  }
</style>

<main class:disabled={showNewItemModal}>
  <Items />
  <BottomBar>
    <AddButton onAdd={handleOpen} />
  </BottomBar>
</main>
{#if showNewItemModal}
  <NewItemModal onCreated={handleClose} />
{/if}
