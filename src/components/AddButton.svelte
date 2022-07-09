<script lang="ts">
  export let onAdd: Function;

  const handleClick = () => {
    onAdd();
  }
</script>

<style>
  button {
    width: 4rem;
    height: 4rem;
    background-color: #000;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 1rem;
  }
</style>

<button on:click={handleClick}>➕</button>
