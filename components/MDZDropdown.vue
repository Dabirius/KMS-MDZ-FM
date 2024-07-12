<template>
  <v-autocomplete
    :items="props.options"
    item-title="value"
    item-value="id"
    :clearable="false"
    :label="props.label"
    variant="outlined"
    :modelValue="props.modelValue"
    :error-messages="props.errorMessages"
    @update:modelValue="handleUpdateModelValue($event)"
    :menu-props="{ attach: 'dialog', location: 'bottom' }"
  ></v-autocomplete>
</template>

<script setup lang="ts">
export type MDZDropdownOption = {
  id: number;
  value: string;
};

export type MDZDropdownProps = {
  options: Array<MDZDropdownOption>;
  label?: string;
  modelValue?: MDZDropdownOption;
  errorMessages?: Array<string>;
};

const props = defineProps<MDZDropdownProps>();
const emit = defineEmits(["update:modelValue"]);

function handleUpdateModelValue(value: number | null): void {
  if (value === null) {
    return;
  }

  const optionItem = props.options.find((v) => v.id === value);
  if (!optionItem) {
    throw "Dropdown accesses Item, which is not in the provided options. This cannot be and is an error.";
  }
  emit("update:modelValue", optionItem);
}
</script>

<style lang="scss">
@use "../assets/styles/global" as global;
$error-color: #f95859ff;
$outline-color: #00000042;
$outline-hover-color: #000000dd;
$label-color: #000000;
$label-disabled-color: #00000060;

.v-input .v-field__outline {
  color: $outline-color;
  .v-label {
    color: $label-color;
  }
}

.v-overlay-container {
  z-index: 100;
}
.v-field:hover:not(.v-field--focused) .v-field__outline {
  color: $outline-hover-color;
}
.v-input
  .v-field--error:not(.v-field--disabled)
  .v-field__prepend-inner
  > .v-icon,
.v-field--error:not(.v-field--disabled) .v-field__append-inner > .v-icon,
.v-field--error:not(.v-field--disabled) .v-field__clearable > .v-icon {
  color: inherit;
}
.v-input .v-field--error:not(.v-field--disabled) .v-label.v-field-label {
  color: $error-color;
}

.v-input .v-field--error:not(.v-field--disabled) .v-field__outline {
  color: $error-color;
}

.v-input--error:not(.v-input--disabled) .v-input__details > .v-icon,
.v-input--error:not(.v-input--disabled) .v-input__details .v-messages,
.v-input--error:not(.v-input--disabled) .v-input__prepend > .v-icon,
.v-input--error:not(.v-input--disabled) .v-input__prepend .v-messages,
.v-input--error:not(.v-input--disabled) .v-input__append > .v-icon,
.v-input--error:not(.v-input--disabled) .v-input__append .v-messages {
  color: $error-color !important;
}

.v-field--error:not(.v-field--disabled) .v-field__append-inner > .v-icon,
.v-field--error:not(.v-field--disabled) .v-field__clearable > .v-icon {
  color: $error-color !important;
}
.v-field--focused {
  .v-field__outline {
    color: global.$color-action-primary-default;
    .v-label {
      color: global.$color-text-primary;
    }
  }
  .v-field-label--floating {
    color: global.$color-text-primary;
  }
}

.v-field--disabled {
  .v-field__outline {
    color: $outline-color;
    .v-field__outline__start,
    .v-field__outline__end {
      border-style: dotted;
    }
    .v-label {
      color: $label-disabled-color;
    }
  }
}
</style>
