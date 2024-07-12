<template>
  <div style="width: 500px; height: 80vh">
    <MDZDocumentSelector
      entityName="Karl Müller"
      :documents="documents"
      :selectedDocument="undefined"
      @document-selected="selected = $event"
    ></MDZDocumentSelector>
  </div>
</template>

<script setup lang="ts">
import MDZDocumentSelector from "../../components/MDZDocumentSelector";
import { ref } from "vue";
import { MDZDocumentSelectorItem } from "../../types/component-types";

const documents = Array.from(Array(50)).map((_, i) => {
  return {
    id: i,
    name: `Dokument ${i}.pdf`,
  };
});

const selected = ref<MDZDocumentSelectorItem | undefined>(undefined);
</script>

<style scoped></style>
