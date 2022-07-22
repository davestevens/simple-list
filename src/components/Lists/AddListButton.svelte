<script lang="ts">
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { getContext } from "svelte";
  import NewListModal from "./NewListModal.svelte";
  const { open } = getContext("simple-modal");

  const handleClick = () => open(NewListModal);
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
    cursor: pointer;
  }
</style>

<button on:click={handleClick}>
  <FontAwesomeIcon icon="plus" />
</button>
