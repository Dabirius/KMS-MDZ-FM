<template>
  <MDZChatContainer
    :items="items"
    :newItem="newElement"
    @valueSent="handleValueSent"
  ></MDZChatContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { MDZChatItemData } from "../../utils/types";

const newElement = ref<MDZChatItemData | undefined>(undefined);
const items = ref<Array<MDZChatItemData>>([]);

function handleValueSent(value: string): void {
  items.value.push({
    relatedDocuments: [],
    content: value,
    answer: true,
    subTitle: undefined,
  });
}
</script>

<style scoped lang="scss"></style>
