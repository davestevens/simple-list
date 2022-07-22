<script lang="ts">
  export let label: string;
  export let key: string;
  export let index: number;

  import { onMount, getContext } from "svelte";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { listsStore } from "../../stores/listsStore";
  import { selectedListStore } from "../../stores/selectedListStore";
  import EditListModal from "./EditListModal.svelte";

  const { isInitialized } = getContext("items");
  const { open } = getContext("simple-modal");

  let liElement: HTMLLIElement;

  const handleDeleteClick = () => {
    if (confirm('Are you sure?')) {
      listsStore.removeList(index);
    }
  }

  const handleEditClick = () => {
    open(EditListModal, { index });
  }

  const handleClick = () => {
    selectedListStore.select(key);
  }

  onMount(() => {
    if (isInitialized()) {
      liElement.scrollIntoView({ behavior: "smooth" });
    }
  })
</script>

<style>
  li {
    max-width: 40rem;
    margin: 0 auto;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid grey;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  li:first-of-type {
    margin-top: 1rem;
  }

  li:last-of-type {
    border-bottom: none;
    margin-bottom: 1rem;
  }

  .content {
    width: 100%;
    margin: 0 0.5rem;
  }

  .label {
    font-weight: bold;
  }

  .controls {
    display: flex;
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 1rem;
  }
</style>

<li bind:this={liElement} on:click={handleClick}>
  <div class="content">
    <div class="label">{label}</div>
  </div>
  <div class="controls">
    <button on:click|stopPropagation={handleEditClick}>
      <FontAwesomeIcon icon="pencil" />
    </button>
    <button on:click|stopPropagation={handleDeleteClick}>
      <FontAwesomeIcon icon="trash-can" />
    </button>
  </div>
</li>
