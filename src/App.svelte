<script lang="ts">
  import Modal from "svelte-simple-modal";
  import Items from "./components/Items.svelte";
  import AddButton from "./components/AddButton.svelte";
  import BottomBar from "./components/BottomBar.svelte";
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

<main class:disabled={false}>
  <Modal classWindow="disabled">
    <Items />
    <BottomBar>
      <AddButton />
    </BottomBar>
  </Modal>
</main>
