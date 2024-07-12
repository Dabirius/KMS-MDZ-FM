<template>
  <div
    style="
      background-color: lightgray;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    "
  >
    <MDZSearchbar v-model="model" placeholder="Searchbar light"></MDZSearchbar>
    <MDZSearchbar
      v-model="model"
      placeholder="Searchbar light"
      :disabled="true"
    ></MDZSearchbar>
    <MDZSearchbar
      v-model="model"
      placeholder="Searchbar dark"
      :dark="true"
    ></MDZSearchbar>
    <MDZSearchbar
      v-model="model"
      placeholder="Searchbar dark"
      :dark="true"
      :disabled="true"
    ></MDZSearchbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const model = ref("");
</script>

<style scoped></style>
