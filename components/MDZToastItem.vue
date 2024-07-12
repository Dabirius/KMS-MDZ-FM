<template>
  <div class="chat-item">
    <MDZIcons variant="primary" icon-name="Information" :size="32" />
    <span class="text">{{ props.text }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>();
</script>

<style scoped lang="scss">
@use "../assets/styles/global" as global;

.chat-item {
  @include global.general-typography-text-body;
  color: global.$color-text-on-dark;
  background-color: global.$color-background-panel;
  border-radius: global.$general-size-radius-comp;
  display: flex;
  align-items: center;
  padding: global.$general-spacing-padding-menu-m-hor;
  gap: 16px;
}
</style>
