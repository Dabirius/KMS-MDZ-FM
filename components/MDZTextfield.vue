<template>
	<v-text-field
		class="grey"
		:class="{ 'hint-align-right': props.hintAlignRight }"
		:model-value="props.modelValue"
		:disabled="props.disabled"
		:type="textFieldType"
		:append-inner-icon="appendInnerIcon"
		:error-messages="props.errorMessages"
		:readonly="props.readonly"
		@update:modelValue="emit('update:modelValue', $event)"
		@update:focused="handleUpdateFocus"
		@click:appendInner="handleAppendInnerClick"
		:label="props.label"
		:placeholder="props.placeholder"
		:hint="props.hint"
		persistent-hint
		variant="outlined"
	>
		<template #append-inner>
			<MDZButton
				variant="icon-only"
				:disabled="disabled"
				:icon="iconName"
				:icon-size="iconSize"
				@click="emit('click:actionButton')"
			/>
		</template>
	</v-text-field>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import { IconName } from "~/stores/iconStore.store";

	export type MDZTextfieldProps = {
		modelValue: string;
		label?: string;
		iconName?: IconName;
		iconSize?: number;
		showActionButton?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		placeholder?: string;
		hint?: string;
		hintAlignRight?: boolean;
		errorMessages?: Array<string>;
		password?: boolean;
	};

	const props = withDefaults(defineProps<MDZTextfieldProps>(), {
		label: "",
		disabled: false,
		placeholder: undefined,
	});

	const emit = defineEmits<{
		(e: "update:modelValue", p: string): void;
		(e: "click:actionButton"): void;
	}>();
	const focused = ref(false);
	const textValue = ref(props.modelValue);
	const passwordShow = ref(false);

	function handleUpdateFocus(value: boolean) {
		focused.value = value;
	}
	const showInnerIcon = computed(() => {
		return !focused.value && textValue.value === "";
	});

	const textFieldType = computed(() => {
		return props.password && !passwordShow.value ? "password" : "text";
	});

	const hasError = computed(() => {
		return props.errorMessages && props.errorMessages.length > 0;
	});

	const appendInnerIcon = computed(() => {
		if (props.password) {
			if (hasError.value) {
				return "mdi-alert-circle";
			}
			if (passwordShow.value) {
				return "mdi-eye";
			} else {
				return "mdi-eye-off";
			}
		}
	});

	const prependInnerIcon = computed(() => {
		if (showInnerIcon.value) {
			if (props.password) {
				return "mdi-key";
			} else {
				return props.iconName ? `mdi-${props.iconName}` : undefined;
			}
		} else {
			return undefined;
		}
	});

	function handleAppendInnerClick() {
		if (hasError.value) {
			return;
		}
		passwordShow.value = !passwordShow.value;
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

	.v-field:hover:not(.v-field--focused) .v-field__outline {
		color: $outline-hover-color;
	}
	.v-input
		.v-field--error:not(.v-field--disabled)
		.v-field__prepend-inner
		> .icon-only,
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
		opacity: 1 !important;
		outline: 1px solid global.$color-pb-light-grey !important;
		.v-field__outline {
			color: global.$color-pb-light-grey !important;
			border: unset;
			.v-field__outline__start,
			.v-field__outline__end {
				border: 0px solid black;
				opacity: 1 !important;
			}
			.v-label {
				color: $label-disabled-color;
			}
		}
	}

	.v-text-field.hint-align-right {
		.v-input__details {
			.v-messages {
				text-align: right;
			}
		}
	}

	.v-field--active label.v-label.v-field-label {
		color: global.$color-action-primary-default;
	}
</style>
