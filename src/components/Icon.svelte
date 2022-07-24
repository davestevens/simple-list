<script lang="ts">
  export let label: string;
  export let color: string;
  export let marginRight: string = "0";
  import oppositeColor from "../services/oppositeColor";

  $: foregroundColor = oppositeColor(color);
</script>

<style>
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: 50%;
    text-align: center;
    flex-shrink: 0;
  }
</style>

<template>
  <div
    class="icon"
    style="background-color: {color}; color: {foregroundColor}; margin-right: {marginRight};"
  >
    {label.substring(0, 2)}
  </div>
</template>
