<template>
  <button
    type="button"
    :class="[props.size, props.color ? `color-${props.color}` : '']"
  >
    <span class="label">{{ props.label }}</span>
    <!--		<MDZIcons variant="primary" icon-name="MenuDown" class="menu-icon" :class="{ rotate: open }" :size="32" />-->
  </button>
</template>

<script setup lang="ts">
export type MDZListFolderProps = {
  label: string;
  open: boolean;
  size?: "small" | "large";
  color?: "default" | "sidebar";
};

const props = withDefaults(defineProps<MDZListFolderProps>(), {
  label: "",
  open: false,
  size: "small",
  color: "default",
});
</script>

<style scoped lang="scss">
@use "../assets/styles/global" as global;
button {
  gap: 8px;
  background: transparent;

  &.small {
    @include global.general-typography-text-label();
  }
  &.large {
    @include global.general-typography-text-headline-h6();
  }

  height: 56px;
  border: none;
  display: flex;
  align-items: center;

  &.color-default {
    color: global.$color-text-primary;
  }

  &.color-sidebar {
    color: global.$color-text-on-dark;
  }

  .menu-icon {
    transition: transform 0.4s linear;

    &.rotate {
      transform: rotate(180deg);
    }
  }
}
</style>
