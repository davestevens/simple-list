<script lang="ts">
  export let index: number;

  import { getContext } from "svelte";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { listsStore } from "../../stores/listsStore";
  const { close } = getContext("simple-modal");

  const item = listsStore.getList(index);
  let label: string = item.label;

  const handleEdit = () => {
    if (label.trim()) {
      listsStore.updateList(index, label);
      close();
    }
  }

  const handleDeleteClick = () => {
    if (confirm('Are you sure?')) {
      listsStore.removeList(index);
      close();
    }
  }
</script>

<style>
  button {
    padding: 1rem;
    border: none;
  }

  button.save {
    background-color: blue;
    color: white;
  }

  button.delete {
    background-color: red;
    color: white;
  }

  input, button {
    font-size: inherit;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
  }
</style>

<template>
  <h1>Edit List</h1>
  <form on:submit|preventDefault={handleEdit}>
    <div>
      <!-- svelte-ignore a11y-autofocus -->
      <input id="label" type="text" bind:value={label} autofocus />
    </div>
    <div class="controls">
      <button class="delete" on:click|preventDefault={handleDeleteClick}>
        <FontAwesomeIcon icon="trash-can" />
      </button>
      <button class="save" type="submit">
        <FontAwesomeIcon icon="floppy-disk" />
      </button>
    </div>
  </form>
</template>
