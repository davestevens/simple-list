<script lang="ts">
  export let label: string;
  export let info: string;
  export let color: string;
  export let index: number;

  import { list } from "../stores/list";
  import oppositeColor from "../services/oppositeColor";

  $: foregroundColor = oppositeColor(color);

  const handleClick = () => {
    list.removeItem(index);
  }
</script>

<style>
  li {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid grey;
    display: flex;
    align-items: center;
    position: relative;
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
    margin-right: 0.5rem;
  }

  .label {
    font-weight: bold;
  }

  button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
</style>

<li>
  <div class="icon" style="background-color: {color}; color: {foregroundColor}">{label.substr(0, 2)}</div>
  <div>
    <div class="label">{label}</div>
    <div class="info">{info}</div>
    <button on:click={handleClick}>x</button>
  </div>
</li>
