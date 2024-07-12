<template>
  <div style="background-color: lightgray; padding: 24px">
    <MDZListFolder
      color="sidebar"
      :open="open"
      @click="clickHandler"
      label="Meine Objekte"
    ></MDZListFolder>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MDZListFolder from "../../components/MDZListFolder.vue";

const open = ref(false);

function clickHandler(): void {
  open.value = !open.value;
}
</script>

<style scoped></style>
