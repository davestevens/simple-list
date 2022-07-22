<script lang="ts">
  import AddListButton from "../components/Lists/AddListButton.svelte";
  import BottomBar from "../components/BottomBar.svelte";
  import Lists from "../components/Lists/Lists.svelte";
</script>

<template>
  <Lists />
  <BottomBar>
    <AddListButton />
  </BottomBar>
</template>
