<template>
  <v-menu :activator="props.activator">
    <div class="menu-container">
      <div class="title">
        {{ props.title }}
      </div>
      <div class="function-items">
        <slot></slot>
      </div>
    </div>
  </v-menu>
</template>

<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";

export type MDZMenuProps = {
  title: string;
  activator: string;
  location?: string;
};

const props = defineProps<MDZMenuProps>();
</script>

<style scoped lang="scss">
@use "../assets/styles/global" as global;

.menu-container {
  border-radius: global.$general-size-radius-spec-container;
  background: white;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 14px 2px #0000001f;

  .title {
    @include global.general-typography-text-menu;
    height: 24px;
    padding-left: 24px;
    padding-right: 24px;
  }
  .function-items {
    padding-left: 12px;
    display: flex;
    flex-direction: column;
  }
}
</style>
