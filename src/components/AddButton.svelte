<script lang="ts">
  export let onAdd: Function;

  const handleClick = () => {
    onAdd();
  }
</script>

<style>
  button {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 4rem;
    height: 4rem;
    background-color: #000;
    margin: 0 1rem 1rem 0;
    color: white;
    border-radius: 50%;
    border: none;
    font-size: 1rem;
  }
</style>

<button on:click={handleClick}>➕</button>
