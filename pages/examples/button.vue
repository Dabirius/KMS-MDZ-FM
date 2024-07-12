<template>
  <div class="button-container">
    <MDZButton label="Contained" icon="Bell"></MDZButton>
    <MDZButton
      label="Contained Disabled"
      icon="Bell"
      icon-position="right"
      :disabled="true"
    ></MDZButton>
    <MDZButton label="Contained Secondary" variant="secondary"></MDZButton>
    <MDZButton
      label="Contained Secondary Disabled"
      variant="secondary"
      :disabled="true"
    ></MDZButton>

    <MDZButton size="small" label="Contained" icon="Bell"></MDZButton>
    <MDZButton
      size="small"
      label="Contained Disabled"
      icon="Bell"
      icon-position="right"
      :disabled="true"
    ></MDZButton>
    <MDZButton
      size="small"
      label="Contained Secondary"
      variant="secondary"
    ></MDZButton>
    <MDZButton
      size="small"
      label="Contained Secondary Disabled"
      variant="secondary"
      :disabled="true"
    ></MDZButton>

    <MDZButton variant="icon" icon="Bell" />
    <MDZButton variant="icon-outlined" icon="Bell" />
    <MDZButton variant="icon-only" icon="Bell" />
    <MDZButton variant="icon-only" icon="Bell" loading />
    <MDZButton variant="flat" icon="Bell" label="Bestätigen" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.button-container {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 16px;
  background-color: lightgray;
  padding: 24px;
}
</style>
