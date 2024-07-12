<template>
  <div class="chat-item" :class="{ disabled: props.disabled }">
    <input
      v-bind="$attrs"
      type="text"
      class="input-field"
      :disabled="props.disabled"
      :class="{ dark: props.dark, disabled: props.disabled }"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
type SearchbarProps = {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  dark?: boolean;
};

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<SearchbarProps>();
const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
@use "../assets/styles/global" as global;
.chat-item {
  position: relative;
  overflow: hidden;
  width: 100%;
  @include global.button-ripple();

  &.disabled {
    pointer-events: none;
  }
  .input-field {
    @include global.general-typography-text-label;
    height: global.$general-size-height-comp-s;
    color: global.$color-text-primary;
    background-color: global.$color-action-background-on-light-default;
    border: 1px solid transparent;
    border-radius: global.$general-size-radius-spec-container;
    padding: 8px 12px;
    outline: none;
    width: 100%;
    &::placeholder {
      color: global.$color-text-primary;
    }
    &.dark {
      color: global.$color-text-on-dark;
      background-color: global.$color-action-background-on-dark-default;
      &::placeholder {
        color: global.$color-text-on-dark;
      }
    }
    &.disabled {
      color: global.$color-text-disabled;
      background-color: transparent;
      border-color: global.$color-text-disabled;
      pointer-events: none;
      &::placeholder {
        color: global.$color-text-disabled;
      }
      &.dark {
        color: global.$color-text-disabled;
        border-color: global.$color-action-primary-disabled;
      }
    }

    &:hover {
      background-color: global.$color-action-background-on-light-hover;
    }
    &.dark:hover {
      background-color: global.$color-action-background-on-dark-hover;
    }

    &:focus {
      outline: none;
      background-color: global.$color-action-background-on-light-selected;
    }

    &.dark:focus {
      outline: none;
      background-color: global.$color-action-background-on-dark-selected;
    }
  }
}
</style>
