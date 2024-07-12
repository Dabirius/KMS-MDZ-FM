<template>
  <v-progress-circular indeterminate :size="size" :class="color" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    color:
      | "primary"
      | "secondary"
      | "flat"
      | "sidebar"
      | "icon"
      | "icon-outlined"
      | "icon-only";
    size: number;
  }>(),
  {
    color: "primary",
    size: 20,
  },
);
</script>
<style scoped lang="scss">
@use "../assets/styles/global" as global;
$color-contained-secondary: #000000de;

.primary {
  color: global.$color-text-on-dark;
}

.secondary {
  color: global.$color-border-action-secondary-default;
}
.flat {
  color: $color-contained-secondary;
}
.sidebar {
  color: $color-contained-secondary;
}

.icon {
  color: global.$color-text-on-dark;
}

.icon-outlined {
  color: global.$color-action-primary-default;
}
.icon-only {
  color: global.$color-action-primary-default;
}
</style>
