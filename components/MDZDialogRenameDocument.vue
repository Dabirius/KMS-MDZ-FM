<script setup lang="ts">
	import { ref, computed } from "vue";
	import { useChatscreen } from "~/stores/pages/chatscreen";

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    open?: boolean;
    valid?: boolean;
    loading?: boolean;
    type?: "Document" | "Entity";
  }>(),
  {
    title: "Umbenennen",
    description: "Bitte gib einen neuen Namen für das Dokument ein.",
    confirmLabel: "Umbenennen",
    cancelLabel: "Abbrechen",
    type: "Document",
  },
);
const emit = defineEmits<{
  (e: "dialog:closed"): void;
  (e: "dialog:confirm", data: string | undefined): void;
}>();

const filename = ref<string>("");

const formValid = computed(() => {
  return filename.value !== "";
});

const handleConfirmClick = (event?: KeyboardEvent) => {
  if (event && event.key !== "Enter" && event.type !== "click") {
    return;
  }
  if (!formValid.value) {
    return;
  }

  if (props.type === "Document") {
    const chatStore = useChatscreen();
    chatStore.setRenameDocumentString(filename.value);

    emit("dialog:confirm", undefined);
  }
  if (props.type === "Entity") {
    emit("dialog:confirm", filename.value);
  }
  filename.value = "";
};
</script>

<template>
  <MDZNewDialog
    :title="title"
    :description="description"
    :confirm-label="confirmLabel"
    :cancel-label="cancelLabel"
    @dialog-closed="emit('dialog:closed')"
    @dialog:confirm="handleConfirmClick"
  >
    <div class="document-rename-dialog-content">
      <MDZTextfield
        v-model="filename"
        :hint="type === 'Document' ? '.pdf' : ''"
        label="Name"
        :hint-align-right="true"
      ></MDZTextfield>
    </div>
  </MDZNewDialog>
</template>

<style scoped lang="scss">
.buttongroup {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
