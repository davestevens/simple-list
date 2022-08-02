<script lang="ts">
  // eslint-disable-next-line import/first
  import oppositeColor from '../services/oppositeColor';

  export let label: string;
  export let color: string;
  export let marginRight = '0';

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
