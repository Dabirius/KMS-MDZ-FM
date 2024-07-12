<template>
  <div class="page">
    <div class="dialogs">
      <slot name="dialogs"></slot>
    </div>
    <div class="sidebar">
      <slot name="sidebar"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.page {
  height: 100vh;
  width: 100%;
  display: flex;
  overflow: hidden;
  .sidebar {
    flex: 0 0 auto;
    min-width: 240px;
  }
  .content {
    flex: 1 1 auto;
  }
}
</style>
