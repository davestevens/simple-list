 <script lang="ts">
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import { selectedListStore } from '../stores/selectedListStore';
  
  export let title: string;

  const handleClick = () => {
    selectedListStore.clear();
  };
</script>

<template>
  <TopAppBar variant="fixed">
    <Row>
      <Section>
        <IconButton class="material-icons" on:click={handleClick}>home</IconButton>
        <Title>{title}</Title>
      </Section>
    </Row>
  </TopAppBar>
</template>
