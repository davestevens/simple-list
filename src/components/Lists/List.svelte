<script lang="ts">
  export let label: string;
  export let key: string;
  export let index: number;

  import { getContext } from "svelte";
  import {
    Item,
    Meta,
    Text,
    PrimaryText,
    SecondaryText,
  } from '@smui/list';
  import IconButton from '@smui/icon-button';
  import { listsStore } from "../../stores/listsStore";
  import { selectedListStore } from "../../stores/selectedListStore";
  import EditListModal from "./EditListModal.svelte";
import { createList } from "../../stores/list";

  const { open } = getContext("simple-modal");
  const list = createList(key);
  const listItemCount = list.getItemCount();

  const handleDeleteClick = (event: Event) => {
    event.stopPropagation();
    if (confirm('Are you sure?')) {
      listsStore.removeList(index);
    }
  }

  const handleEditClick = (event: Event) => {
    event.stopPropagation()
    open(EditListModal, { index });
  }

  const handleClick = () => {
    selectedListStore.select(key, label);
  }
</script>

<template>
  <Item on:click={handleClick}>
    <Text>
      <PrimaryText>{label}</PrimaryText>
      <SecondaryText>{listItemCount} item{listItemCount === 1 ? '' : 's'}</SecondaryText>
    </Text>
    <Meta class="material-icons">
      <IconButton class="material-icons" on:click={handleEditClick}>edit</IconButton>
      <IconButton class="material-icons" on:click={handleDeleteClick}>delete</IconButton>
    </Meta>
  </Item>
</template>
