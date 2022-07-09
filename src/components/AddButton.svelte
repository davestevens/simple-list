<script lang="ts">
  export let onAdd: Function;
  import { FontAwesomeIcon } from 'fontawesome-svelte';

  const handleClick = () => {
    onAdd();
  }
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
