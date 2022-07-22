<script lang="ts">
  export let index: number;

  import { getContext } from "svelte";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { getCurrentlySelectedList } from "../../services/currentlySelectedList";
  const { close } = getContext("simple-modal");

  const list = getCurrentlySelectedList();
  const item = list.getItem(index);
  let label: string = item.label;
  let info: string = item.info;

  const handleEdit = () => {
    if (label.trim()) {
      list.updateItem(index, label, info);
      close();
    }
  }

  const handleDeleteClick = () => {
    if (confirm('Are you sure?')) {
      list.removeItem(index);
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

  input, textarea, button {
    font-size: inherit;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
  }
</style>

<template>
  <h1>Edit Item</h1>
  <form on:submit|preventDefault={handleEdit}>
    <div>
      <!-- svelte-ignore a11y-autofocus -->
      <input id="label" type="text" bind:value={label} autofocus />
    </div>
    <div>
      <label for="info">Notes</label>
      <br/>
      <textarea id="info" bind:value={info}></textarea>
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
