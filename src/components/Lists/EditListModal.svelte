<script lang="ts">
  export let index: number;

  import { getContext } from "svelte";
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import Button, { Icon, Label } from '@smui/button';
  import { listsStore } from "../../stores/listsStore";
  const { close } = getContext("simple-modal");

  const item = listsStore.getList(index);
  let label: string = item.label;

  const handleEdit = () => {
    if (label.trim()) {
      listsStore.updateList(index, label);
      close();
    }
  }

  const handleDeleteClick = () => {
    if (confirm('Are you sure?')) {
      listsStore.removeList(index);
      close();
    }
  }
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
