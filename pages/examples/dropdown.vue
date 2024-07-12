<template>
  <div style="padding: 24px">
    <MDZDropdown
      label="Mitarbeiter"
      :options="options"
      v-model="m"
    ></MDZDropdown>
  </div>
</template>

<script setup lang="ts">
import { MDZDropdownOption } from "../../components/MDZDropdown.vue";
import { ref } from "vue";

const options: Array<MDZDropdownOption> = [
  {
    id: 0,
    value: "Gustav Mahler",
  },
  {
    id: 1,
    value: "Erich Wolfgang Korngold",
  },
  {
    id: 2,
    value: "Ralph Vaughan Williams",
  },
];

const m = ref<MDZDropdownOption | undefined>(undefined);
</script>

<style lang="scss"></style>
