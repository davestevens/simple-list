<script lang="ts">
  export let label: string;
  export let info: string;
  export let color: string;
  export let index: number;

  import { onMount, getContext } from "svelte";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { getCurrentlySelectedList } from "../../services/currentlySelectedList";
  import oppositeColor from "../../services/oppositeColor";
  import EditItemModal from "./EditItemModal.svelte";

  const { isInitialized } = getContext("items");
  const { open } = getContext("simple-modal");

  let liElement: HTMLLIElement;
  $: foregroundColor = oppositeColor(color);

  const handleDeleteClick = () => {
    getCurrentlySelectedList().removeItem(index);
  }

  const handleEditClick = () => {
    open(EditItemModal, { index });
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
  }

  li:first-of-type {
    margin-top: 1rem;
  }

  li:last-of-type {
    border-bottom: none;
    margin-bottom: 1rem;
  }

  .icon {
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: 50%;
    text-align: center;
    flex-shrink: 0;
  }

  .content {
    width: 100%;
    margin: 0 0.5rem;
  }

  .label {
    font-weight: bold;
  }

  .info {
    font-weight: normal;
  }

  .controls {
    display: flex;
  }

  button {
    background-color: transparent;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }
</style>

<li bind:this={liElement}>
  <div
    class="icon"
    style="background-color: {color}; color: {foregroundColor}"
  >
    {label.substring(0, 2)}
  </div>
  <div class="content">
    <div class="label">{label}</div>
    <div class="info">{info}</div>
  </div>
  <div class="controls">
    <button on:click={handleEditClick}>
      <FontAwesomeIcon icon="pencil" />
    </button>
    <button on:click={handleDeleteClick}>
      <FontAwesomeIcon icon="trash-can" />
    </button>
  </div>
</li>
