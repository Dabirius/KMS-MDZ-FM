<script setup lang="ts">
import { computed } from "vue";
import { useChatscreen } from "~/stores/pages/chatscreen";

const emit = defineEmits<{
  (e: "form-submit"): void;
  (e: "dialog-closed"): void;
}>();

const documentNamesList = ref("");
const chatStore = useChatscreen();
const { selectedDocumentItem } = storeToRefs(chatStore);

function handleConfirmClick(): void {
  emit("form-submit");
}

function handleCancelClick(): void {
  emit("dialog-closed");
}
</script>

<template>
  <MDZNewDialog
    title="Löschen"
    description="subtitle"
    confirm-label="Bestätigen"
    cancel-label="Abbrechen"
  >
  </MDZNewDialog>
</template>

<style scoped lang="scss">
.buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  * {
    width: 100%;
  }
}
</style>
