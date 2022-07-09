<script lang="ts">
  import { FontAwesomeIcon } from 'fontawesome-svelte';
  import { getContext } from 'svelte';
  import NewItemModal from './NewItemModal.svelte';
  const { open } = getContext('simple-modal');

  const handleClick = () => open(NewItemModal);
</script>

<style>
  button {
    width: 4rem;
    height: 4rem;
    background-color: blue;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 1rem;
  }
</style>

<button on:click={handleClick}>
  <FontAwesomeIcon icon="plus" />
</button>
