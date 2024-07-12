<template>
  <label :class="[{ disabled: props.disabled }]">
    <input
      type="checkbox"
      :value="model"
      :checked="model"
      :disabled="props.disabled"
      v-model="model"
    />
    <div class="square-container">
      <MDZIcons v-if="model" icon-name="Check" :size="18" />
      <div class="square" :class="{ checked: model }"></div>
    </div>
    <div class="label" v-if="label">
      {{ props.label }}
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

type CheckboxProps = {
  value: string; // value text
  modelValue: boolean;
  disabled?: boolean;
  label?: string;
};

const props = defineProps<CheckboxProps>();
const emit = defineEmits(["update:modelValue"]);
const model = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
  },
});
</script>

<style scoped lang="scss">
@use "../assets/styles/global" as global;

label {
  @include global.general-typography-text-label();
  color: global.$color-text-on-secondary;
  display: flex;
  align-items: center;
  width: fit-content;

  .square-container {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 10px;
  }
  .square {
    width: 18px;
    height: 18px;
    border: 2px solid global.$color-adornment-default;
    border-radius: 2px;
    &.checked {
      background-color: global.$color-adornment-default;
    }
  }
  .check-icon {
    position: absolute;
    color: global.$color-adornment-on-dark;
  }

  &.disabled {
    color: global.$color-adornment-disabled;
    input {
      pointer-events: none;
    }
    .square {
      border-color: global.$color-adornment-disabled;
      background-color: global.$color-adornment-disabled;
    }
  }
}
input {
  opacity: 0;
  display: contents;
}
</style>
