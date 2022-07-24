<script lang="ts">
  import Fab, { Icon } from '@smui/fab';
  import { getContext } from "svelte";
  import NewItemModal from "./NewItemModal.svelte";
  const { open } = getContext("simple-modal");

  const handleClick = () => open(NewItemModal);
</script>

<style>
  .add {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
  }
</style>

<template>
  <div class="add">
    <Fab on:click={handleClick}>
      <Icon class="material-icons">add</Icon>
    </Fab>
  </div>
</template>
