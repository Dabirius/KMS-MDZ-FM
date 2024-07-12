<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  title: string;
  activator?: HTMLElement;
  show?: boolean;
  location?: { x: number; y: number };
}>();
const emit = defineEmits<{
  (e: "hide"): void;
  (e: "click:delete"): void;
  (e: "click:rename"): void;
}>();
const show = ref<boolean | undefined>();
const coordinates = ref<{ x: number; y: number }>();

watch(
  () => props.show,
  () => {
    show.value = props.show;
    coordinates.value = props.location;
  },
);
watch(show, () => {
  if (!show.value) {
    coordinates.value = undefined;
    emit("hide");
  }
});
</script>
<template>
  <v-menu
    v-model="show"
    :activator="activator ?? undefined"
    :target="
      coordinates?.x && coordinates?.y
        ? [coordinates?.x, coordinates?.y]
        : undefined
    "
    origin="overlap"
    location-strategy="connected"
  >
    <div class="menu-container">
      <span class="title">{{ title }}</span>
      <MDZButton
        variant="flat"
        label="Umbenennen"
        icon="Pencil"
        @click="emit('click:rename')"
      />
      <MDZButton
        variant="flat"
        label="Löschen"
        icon="Delete"
        @click="emit('click:delete')"
      />
    </div>
  </v-menu>
</template>
<style scoped lang="scss">
@use "../assets/styles/global" as global;

$bg-darker: rgba(255, 255, 255, 0.1);
.menu-container {
  display: flex;
  position: absolute;
  flex-direction: column;
  min-width: 210px;
  color: global.$color-text-on-secondary;
  background: global.$color-background-menu;
  border-radius: global.$general-size-radius-spec-container;
  box-shadow: 0px 3px 14px 2px #0000001f;
  padding: 8px;

  .title {
    @include global.general-typography-text-menu();
    color: global.$color-text-on-secondary;
    padding-left: 24px;
    padding-bottom: 8px;
  }
}
</style>
