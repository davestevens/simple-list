<script lang="ts">
  export let label: string;
  export let info: string;
  export let color: string;
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
  import { getCurrentlySelectedList } from "../../services/currentlySelectedList";
  import Icon from "../Icon.svelte";
  import EditItemModal from "./EditItemModal.svelte";

  const { open } = getContext("simple-modal");

  const handleDeleteClick = () => {
    getCurrentlySelectedList().removeItem(index);
  }

  const handleEditClick = () => {
    open(EditItemModal, { index });
  }
</script>

  <template>
  <Item>
    <Icon {color} {label} marginRight="0.5rem" />
    <Text>
      <PrimaryText>{label}</PrimaryText>
      <SecondaryText>{info}</SecondaryText>
    </Text>
    <Meta class="material-icons">
      <IconButton class="material-icons" on:click={handleEditClick}>edit</IconButton>
      <IconButton class="material-icons" on:click={handleDeleteClick}>delete</IconButton>
    </Meta>
  </Item>
</template>
