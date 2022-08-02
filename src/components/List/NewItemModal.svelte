<script lang="ts">
  import { getContext } from 'svelte';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import Button, { Icon, Label } from '@smui/button';
  import { getCurrentlySelectedList } from '../../services/currentlySelectedList';
  import { ISimpleModalContext } from '../../types';
  
  const { close } = getContext<ISimpleModalContext>('simple-modal');

  let label = '';
  let info = '';

  const handleSave = () => {
    if (label.trim()) {
      getCurrentlySelectedList().addItem(label, info);
      close();
    }
  };
</script>

<template>
  <Dialog
    aria-labelledby="new-item-modal"
    open={true}
  >
    <Title id="new-item-modal">Add Item</Title>
    <form on:submit|preventDefault={handleSave}>
      <Content id="simple-content">
        <Textfield
          type="text"
          style="width: 100%; margin-bottom: 1rem;"
          helperLine$style="width: 100%;"
          bind:value={label}
          label="Label"
        />
        <Textfield
          type="text"
          textarea
          style="width: 100%; margin-bottom: 1rem;"
          helperLine$style="width: 100%;"
          bind:value={info}
          label="Notes"
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
