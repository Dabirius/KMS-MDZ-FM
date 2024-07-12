<template>
  <div style="height: 100vh">
    <MDZSidebar
      :selectedEntry="selected"
      :data="exampleData"
      @selected:entry="selected = $event"
      @trigger:search="console.log($event)"
      @click:new-customer="console.log('New Entity Clicked')"
    ></MDZSidebar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type SidebarEntry = {
  id: number;
  label: string;
  selected?: boolean;
};

const exampleData: Array<SidebarEntry> = [
  {
    id: 1,
    label: "Müller Karl",
    selected: true,
  },
  {
    id: 2,
    label: "Stettin Renate",
  },
  {
    id: 3,
    label: "Heuer Anton",
  },
  {
    id: 4,
    label: "Maler Tina",
  },
  {
    id: 5,
    label: "Stettin Bernhard",
  },
  {
    id: 6,
    label: "Paulus Elisabeth",
  },
];

const selected = ref<SidebarEntry | undefined>(undefined);
</script>

<style scoped lang="scss"></style>
