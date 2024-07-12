<template>
	<component
		v-if="iconComponent"
		:is="iconComponent"
		:size="size"
		:class="[`${variant}`, { disabled: disabled }]"
	/>
</template>

<script setup lang="ts">
	import { ref, watchEffect, markRaw } from "vue";
	import icons, { IconName } from "../stores/iconStore.store"; // Adjust the path as necessary
	import { defineProps } from "vue";

	const props = withDefaults(
		defineProps<{
			iconName: IconName;
			size?: number;
			variant?:
				| "primary"
				| "secondary"
				| "flat"
				| "sidebar"
				| "icon"
				| "icon-outlined"
				| "icon-only";
			disabled?: boolean;
		}>(),
		{
			size: 18,
			variant: "primary",
			disabled: false,
		}
	);

	const iconComponent = ref<(typeof icons)[0]>(null); //Linter hack since it doesn't like an 'any' here

	watchEffect(() => {
		if (props.iconName in icons) {
			iconComponent.value = markRaw(icons[props.iconName]);
		} else {
			iconComponent.value = null;
		}
	});
</script>
<style scoped lang="scss">
	@use "../assets/styles/global" as global;
	$bg-contained-primary: #000000;
	$bg-contained-secondary: #f2f2f2;
	$bg-contained-secondary-hover: #fafafa;
	$color-contained-secondary: #000000de;

	span {
		&.primary {
			color: global.$color-text-on-dark;
		}
		&.secondary {
			color: $color-contained-secondary;
		}
		&.flat {
			color: $color-contained-secondary;
		}
		&.sidebar {
			color: global.$color-text-on-dark;
		}
		&.icon {
			color: #000;
		}
		&.icon-outlined {
			color: global.$color-action-primary-default;
		}
		&.icon-only {
			color: global.$color-text-disabled;

			&.disabled {
				color: global.$color-light-border-fComp-disabled;
			}
		}

		&:hover {
			color: global.$color-action-primary-default;
		}

		&.disabled {
			color: global.$color-action-background-on-dark-disabled;
		}
	}
</style>
