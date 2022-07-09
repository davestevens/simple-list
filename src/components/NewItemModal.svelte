<script lang="ts">
  export let onCreated: Function;
  import { list } from "../stores/list";

  let label: string = "";
  let info: string = "";

  const handleKeydown = (event) => {
    if (event.keyCode === 13) {
      handleSave();
    }
	}

  const handleSave = () => {
    if (label.trim()) {
      list.addItem(label, info);
    }
    onCreated();
  }

  const handleCancel = () => {
    onCreated();
  }

</script>

<style>
  .modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  main {
    width: 80%;
    background-color: white;
    border: 1px solid grey;
    padding: 2rem;
    box-sizing: border-box;
    box-shadow: 0 0.25rem 0.5rem grey;
  }

  button {
    padding: 1rem;
    float: right;
    border: none;
  }

  button.save {
    background-color: blue;
    color: white;
  }

  button.cancel {
    background-color: white;
    color: initial;
  }

  input, textarea, button {
    font-size: inherit;
  }
</style>

<svelte:window on:keydown={handleKeydown}/>

<div class="modal-wrapper">
  <main>
    <h1>Add new item</h1>
    <div>
      <!-- svelte-ignore a11y-autofocus -->
      <input id="label" type="text" bind:value={label} autofocus />
    </div>
    <div>
      <label for="info">Notes</label>
      <br/>
      <textarea id="info" bind:value={info}></textarea>
    </div>
    <button class="save" on:click={handleSave}>Save</button>
    <button class="cancel" on:click={handleCancel}>Cancel</button>
  </main>
</div>
