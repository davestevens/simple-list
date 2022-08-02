<script lang="ts">
  import Fab, { Icon } from '@smui/fab';
  import { getContext } from 'svelte';
  import NewListModal from './NewListModal.svelte';
  import { ISimpleModalContext } from '../../types';
  
  const { open } = getContext<ISimpleModalContext>('simple-modal');

  const handleClick = () => open(NewListModal);
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
