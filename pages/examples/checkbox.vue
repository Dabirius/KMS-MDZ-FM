<template>
  <div style="padding: 24px; background-color: lightgray">
    <MDZCheckbox v-model="model" value="cb1"></MDZCheckbox>
    <MDZCheckbox
      v-model="model"
      :disabled="true"
      value="cb2"
      label="Disabled"
    ></MDZCheckbox>
  </div>
</template>

<script setup lang="ts">
import MDZCheckbox from "../../components/MDZCheckbox.vue";
import { ref } from "vue";

const model = ref(false);
</script>

<style scoped></style>
