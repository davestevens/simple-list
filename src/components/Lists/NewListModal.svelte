<script lang="ts">
  import { getContext } from 'svelte';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import Button, { Icon, Label } from '@smui/button';
  import { listsStore } from '../../stores/listsStore';
  import { ISimpleModalContext } from '../../types';
  
  const { close } = getContext<ISimpleModalContext>('simple-modal');

  let label = '';

  const handleSave = () => {
    if (label.trim()) {
      listsStore.addItem(label);
      close();
    }
  };
</script>

<template>
  <Dialog
    aria-labelledby="new-list-modal"
    open={true}
  >
    <Title id="new-list-modal">Add List</Title>
    <form on:submit|preventDefault={handleSave}>
      <Content id="simple-content">
        <Textfield
          type="text"
          style="width: 100%; margin-bottom: 1rem;"
          helperLine$style="width: 100%;"
          bind:value={label}
          label="Name"
        />
      </Content>
      <Actions>
        <Button type="submit">
          <Icon class="material-icons">save</Icon>
          <Label>Create</Label>
        </Button>
      </Actions>
    </form>
  </Dialog>
</template>
