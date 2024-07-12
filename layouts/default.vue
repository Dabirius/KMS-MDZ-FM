<template>
  <slot />
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
useHead({
  bodyAttrs: {
    class: "theme-default",
  },
});
</script>

<style scoped></style>
