<script lang="ts">
  import { getContext } from "svelte";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { listsStore } from "../../stores/listsStore";
  const { close } = getContext("simple-modal");

  let label: string = "";

  const handleSave = () => {
    if (label.trim()) {
      listsStore.addItem(label);
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

  input, button {
    font-size: inherit;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
  }
</style>

<template>
  <h1>Add new list</h1>
  <form on:submit|preventDefault={handleSave}>
    <div>
      <!-- svelte-ignore a11y-autofocus -->
      <input id="label" type="text" bind:value={label} autofocus />
    </div>
    <div class="controls">
      <button class="save" type="submit">
        <FontAwesomeIcon icon="floppy-disk" />
      </button>
    </div>
  </form>
</template>
