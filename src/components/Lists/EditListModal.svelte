<script lang="ts">
  import { getContext } from 'svelte';
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import Button, { Icon, Label } from '@smui/button';
  import { listsStore } from '../../stores/listsStore';
  import { ISimpleModalContext } from '../../types';
  
  export let index: number;
  
  const { close } = getContext<ISimpleModalContext>('simple-modal');

  const item = listsStore.getList(index);
  let { label } = item;

  const handleEdit = () => {
    if (label.trim()) {
      listsStore.updateList(index, label);
      close();
    }
  };

  const handleDeleteClick = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure?')) {
      listsStore.removeList(index);
      close();
    }
  };
</script>

<template>
  <Dialog
    aria-labelledby="edit-list-modal"
    open={true}
  >
    <Title id="edit-list-modal">Edit List</Title>
    <form on:submit|preventDefault={handleEdit}>
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
        <Button color="secondary" on:click={handleDeleteClick}>
          <Icon class="material-icons">delete</Icon>
          <Label>Delete</Label>
        </Button>
        <Button type="submit">
          <Icon class="material-icons">save</Icon>
          <Label>Update</Label>
        </Button>
      </Actions>
    </form>
  </Dialog>
</template>
