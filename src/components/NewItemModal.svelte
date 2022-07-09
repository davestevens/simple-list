<script lang="ts">
  import { getContext } from "svelte";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { list } from "../stores/list";
  const { close } = getContext('simple-modal');

  let label: string = "";
  let info: string = "";

  const handleSave = () => {
    if (label.trim()) {
      list.addItem(label, info);
      close();
    }
  }
</script>

<style>
  button {
    padding: 1rem;
    float: right;
    border: none;
  }

  button.save {
    background-color: blue;
    color: white;
  }

  input, textarea, button {
    font-size: inherit;
  }
</style>

<template>
  <h1>Add new item</h1>
  <form on:submit={handleSave}>
    <div>
      <!-- svelte-ignore a11y-autofocus -->
      <input id="label" type="text" bind:value={label} autofocus />
    </div>
    <div>
      <label for="info">Notes</label>
      <br/>
      <textarea id="info" bind:value={info}></textarea>
    </div>
    <button class="save" type="submit">
      <FontAwesomeIcon icon="floppy-disk" />
    </button>
  </form>
</template>
