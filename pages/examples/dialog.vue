<template>
  <MDZDialog
    title="Neues Dokument"
    subtitle="Bitte lade das Dokument als PDF hier hoch."
    :open="open"
    @dialog-closed="open = false"
  >
    <template v-slot:content>
      <MDZTextfield
        style="padding-bottom: 16px"
        label="Hochladen"
        placeholder="Datei hinzufügen oder hier ablegen."
        hint="Maximale Dateigröße 10MB"
        v-model="tf1Model"
        :showActionButton="true"
        icon-name="FileUploadOutline"
      >
      </MDZTextfield>
      <MDZTextfield
        v-model="tf2Model"
        hint=".pdf"
        :hintAlignRight="true"
      ></MDZTextfield>
    </template>
    <template v-slot:footer>
      <MDZButton
        variant="primary"
        label="Bestätigen"
        @click="open = false"
      ></MDZButton>
    </template>
  </MDZDialog>
  <MDZButton label="Open Dialog" @click="open = !open"></MDZButton>
</template>

<script setup lang="ts">
import MDZButton from "../../components/MDZButton.vue";
import { ref } from "vue";
import MDZTextfield from "../../components/MDZTextfield.vue";
const open = ref<boolean>(false);
const tf1Model = ref("Hallo");
const tf2Model = ref("Hey!");
</script>
