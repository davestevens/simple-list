<script lang="ts">
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { selectedListStore } from "../../stores/selectedListStore";

  const handleClick = () => {
    selectedListStore.clear();
  };
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
  <FontAwesomeIcon icon="chevron-left" />
</button>
