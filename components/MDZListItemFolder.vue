<template>
  <button
    type="button"
    :class="{ selected: props.selected }"
    v-ripple
    @contextmenu.prevent="emit('click:menu', $event)"
  >
    <MDZIcons variant="primary" icon-name="Folder" :size="18" />
    <span class="label">{{ props.label }}</span>
    <div
      v-if="showMenu"
      v-ripple
      class="dot-menu"
      @click="emit('click:menu', $event)"
    >
      <MDZIcons variant="primary" icon-name="DotMenu" :size="18" />
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  selected: boolean;
  showMenu?: boolean;
}>();

const emit = defineEmits<{
  (e: "click:menu", value: MouseEvent): void;
}>();
</script>

<style scoped lang="scss">
@use "../assets/styles/global" as global;
button {
  display: flex;
  gap: 5px;
  align-items: center;
  @include global.general-typography-text-label();
  color: global.$color-text-on-dark;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  border: none;
  height: 40px;
  border-radius: global.$general-size-radius-spec-container;
  padding: 0 global.$general-spacing-padding-action-xs-hor;
  width: 100%;

  .dot-menu {
    display: flex;
    align-items: center;
    width: global.$general-size-height-icon-action-s;
    height: global.$general-size-height-icon-action-s;
    position: relative;
    border-radius: 50%;
    --ripple-color: #{global.$color-action-primary-pressed-ripple};
    @include global.button-ripple(18px);
  }
  .icon {
    flex: 0 0 auto;
  }
  .label {
    flex: 1 1 auto;
    text-align: left;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .dot-menu {
    visibility: hidden;
    flex: 0 0 auto;
  }
  &:hover {
    background-color: global.$color-background-action-on-dark-hover;
  }
  &.selected {
    background: global.$color-background-action-on-dark-selected;
    .dot-menu,
    .icon {
      visibility: visible;
    }
  }
}
</style>
