<script lang="ts">
  export let index: number;

  import { getContext } from "svelte";
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import Button, { Icon, Label } from '@smui/button';
  import { getCurrentlySelectedList } from "../../services/currentlySelectedList";
  const { close } = getContext("simple-modal");

  const list = getCurrentlySelectedList();
  const item = list.getItem(index);
  let label: string = item.label;
  let info: string = item.info;

  const handleEdit = () => {
    if (label.trim()) {
      list.updateItem(index, label, info);
      close();
    }
  }

  const handleDeleteClick = () => {
    if (confirm('Are you sure?')) {
      list.removeItem(index);
      close();
    }
  }
</script>

<template>
  <Dialog
    aria-labelledby="edit-item-modal"
    open={true}
  >
    <Title id="edit-item-modal">Edit Item</Title>
    <form on:submit|preventDefault={handleEdit}>
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
