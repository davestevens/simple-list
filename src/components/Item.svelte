<script lang="ts">
  export let label: string;
  export let info: string;
  export let color: string;
  export let index: number;

  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { list } from "../stores/list";
  import oppositeColor from "../services/oppositeColor";

  $: foregroundColor = oppositeColor(color);

  const handleClick = () => {
    if (confirm("delete")) {
      list.removeItem(index);
    }
  }
</script>

<style>
  li {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid grey;
    display: flex;
    align-items: center;
  }

  li:first-of-type {
    margin-top: 1rem;
  }

  li:last-of-type {
    border-bottom: none;
    margin-bottom: 1rem;
  }

  .icon {
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: 50%;
    text-align: center;
    flex-shrink: 0;
  }

  .content {
    width: 100%;
    margin: 0 0.5rem;
  }

  .label {
    font-weight: bold;
  }

  .info {
    font-weight: normal;
  }

  .controls {
    display: block;
  }

  button {
    background-color: transparent;
    border: none;
    font-size: 1rem;
  }
</style>

<li>
  <div class="icon" style="background-color: {color}; color: {foregroundColor}">
    {label.substring(0, 2)}
  </div>
  <div class="content">
    <div class="label">{label}</div>
    <div class="info">{info}</div>
  </div>
  <div class="controls">
    <button on:click={handleClick}>
      <FontAwesomeIcon icon="trash-can" />
    </button>
  </div>
</li>
