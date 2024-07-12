<script setup lang="ts">
import { ref, onMounted, defineEmits } from "vue";

export interface DialogOptions {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  open?: boolean;
  valid?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<DialogOptions>(), {
  open: false,
  valid: true,
  loading: false,
});

const emit = defineEmits<{
  (e: "dialog:confirm"): void;
  (e: "dialog:cancel"): void;
  (e: "dialog:open"): void;
  (e: "dialog:close"): void;
}>();

const dialogRef = ref<HTMLDialogElement>();

const handleConfirm = () => {
  emit("dialog:confirm");
  dialogRef.value?.close();
};
const handleCancel = () => {
  emit("dialog:cancel");
  dialogRef.value?.close();
};

const handleKeyEvents = (event: KeyboardEvent) => {
  switch (event.key) {
    case "Enter":
      handleConfirm();
      return;
    case "Escape":
      handleCancel();
      return;
  }
};

onMounted(() => {
  dialogRef.value?.showModal();
  window.addEventListener("keydown", handleKeyEvents);
  emit("dialog:open");
});

onUnmounted(() => {
  emit("dialog:close");
});
</script>

<template>
  <dialog class="dialog" ref="dialogRef">
    <div class="top">
      <h5 class="title">{{ title }}</h5>
      <div class="subtitle">
        {{ description }}
      </div>
    </div>

    <div class="content">
      <slot></slot>
    </div>
    <div class="footer">
      <MDZButton
        variant="primary"
        :label="confirmLabel"
        size="wide"
        :disabled="!valid"
        :loading="loading"
        @click="handleConfirm"
      />
      <MDZButton
        v-if="cancelLabel"
        variant="secondary"
        :label="cancelLabel"
        size="wide"
        @click="handleCancel"
      />
    </div>
  </dialog>
</template>
<style scoped lang="scss">
@use "../assets/styles/global" as global;

.dialog {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 16px;
  top: 30%;
  left: 40%;
  width: 400px;
  background-color: global.$color-background-card;
  box-shadow: 0px 3px 14px 2px #0000001f;
  border: unset;
  border-radius: global.$general-size-radius-spec-container;
  padding: 16px;
  overflow: initial;
  .top {
    .title {
      @include global.general-typography-text-headline-h5();
      color: global.$color-text-on-secondary;
    }

    .subtitle {
      @include global.general-typography-text-body();
      color: global.$color-text-helper;
    }
  }
  .footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &[open]::backdrop {
    background-color: #0000001f;
  }
}
</style>
