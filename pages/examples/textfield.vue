<template>
  <div style="display: flex; flex-direction: column; gap: 12px; padding: 24px">
    <MDZTextfield
      v-model="model"
      placeholder="E-Mail"
      label="E-Mail"
      iconName="pencil"
    ></MDZTextfield>
    <MDZTextfield
      v-model="model"
      placeholder="E-Mail"
      :errorMessages="errors"
      label="E-Mail"
      iconName="pencil"
    ></MDZTextfield>
    <MDZTextfield
      v-model="model"
      placeholder="E-Mail"
      :disabled="true"
      iconName="pencil"
    ></MDZTextfield>
    <!-- ======================= -->
    <MDZTextfield
      v-model="pwdModel"
      :password="true"
      label="Password"
    ></MDZTextfield>
    <MDZTextfield
      v-model="pwdModel"
      :errorMessages="errors"
      :password="true"
      label="Password"
    ></MDZTextfield>
    <MDZTextfield
      v-model="pwdModel"
      :disabled="true"
      :password="true"
    ></MDZTextfield>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const model = ref("");
const pwdModel = ref("");

const errors = ["Errors here"];
</script>

<style scoped></style>
