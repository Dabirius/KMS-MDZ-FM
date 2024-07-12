<template>
  <v-dialog
    width="auto"
    :model-value="props.open"
    @update:modelValue="handleDialogModelValueChange($event)"
  >
    <div class="dialog">
      <div class="top">
        <h5 class="title">{{ props.title }}</h5>
        <div class="subtitle">
          {{ props.subtitle }}
        </div>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
export type MDZCardProps = {
  title: string;
  subtitle: string;
  open: boolean;
};
const props = defineProps<MDZCardProps>();
const emit = defineEmits<{
  (e: "dialog-closed"): void;
}>();

function handleDialogModelValueChange(value: boolean): void {
  if (value === false) {
    emit("dialog-closed");
  }
}
</script>

<style scoped lang="scss">
@use "../assets/styles/global" as global;

.dialog {
  width: 400px;
  background-color: global.$color-background-card;
  box-shadow: 0px 3px 14px 2px #0000001f;
  border-radius: global.$general-size-radius-spec-container;
  .top {
    padding: 16px;
    .title {
      @include global.general-typography-text-headline-h5();
      color: global.$color-text-on-secondary;
    }

    .subtitle {
      @include global.general-typography-text-body();
      color: global.$color-text-helper;
    }
  }
  .content {
    padding: 16px;
  }
  .footer {
    padding: 16px;
  }
}
</style>
