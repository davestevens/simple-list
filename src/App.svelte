<script lang="ts">
  import Items from "./components/Items.svelte";
  import AddButton from "./components/AddButton.svelte";
  import NewItemModal from "./components/NewItemModal.svelte";

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
    width: 100%;
    height: 100%;
  }

  .disabled {
    filter: blur(0.25rem);
    overflow: hidden;
    pointer-events: none;
  }
</style>

<main class:disabled={showNewItemModal}>
  <Items />
  <AddButton onAdd={handleOpen} />
</main>
{#if showNewItemModal}
  <NewItemModal onCreated={handleClose} />
{/if}
