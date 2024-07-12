<template>
	<button
		v-bind="$attrs"
		class="contained"
		v-ripple
		:disabled="disabled"
		:class="[
			`variant-${props.variant}`,
			`size-${size}`,
			{ icon: icon },
			{ toggle: toggle },
			{ [`iconPosition-${iconPosition}`]: iconPosition },
			{ disabled: props.disabled },
		]"
	>
		<MDZLoadingSpinner v-if="loading" :color="variant" />
		<span v-if="label && !loading && variant !== 'icon-only'">{{ label }}</span>
		<MDZIcons
			v-if="icon && !loading"
			class="pointer-none"
			:disabled="disabled"
			:variant="variant"
			:iconName="icon"
			:size="iconSize"
		/>
	</button>
</template>

<script setup lang="ts">
	import { IconName } from "~/stores/iconStore.store";
	export type MDZButtonProps = {
		label?: string;
		variant?:
			| "primary"
			| "secondary"
			| "flat"
			| "sidebar"
			| "icon"
			| "icon-outlined"
			| "icon-only";
		size?: "small" | "wide";
		disabled?: boolean;
		icon?: IconName;
		iconPosition?: "left" | "right";
		iconSize?: number;
		loading?: boolean;
		toggle?: boolean;
	};

	const props = withDefaults(defineProps<MDZButtonProps>(), {
		label: undefined,
		variant: "primary",
		size: "wide",
		disabled: false,
		iconPosition: "left",
		icon: undefined,
		loading: false,
		toggle: false,
	});
</script>

<style scoped lang="scss">
	@use "../assets/styles/global" as global;
	$bg-contained-primary: #000000;
	$bg-contained-secondary: #f2f2f2;
	$bg-contained-secondary-hover: #fafafa;
	$color-contained-secondary: #000000de;

	button {
		@include global.general-typography-text-button-s();
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		padding-left: global.$general-spacing-padding-action-s-hor;
		padding-right: global.$general-spacing-padding-action-s-hor;
		border: none;
		position: relative;
		border-radius: global.$general-size-radius-comp;
		overflow: hidden;
		box-shadow:
			0px 1px 5px 0px rgba(0, 0, 0, 0.12),
			0px 2px 2px 0px rgba(0, 0, 0, 0.14),
			0px 3px 1px -2px rgba(0, 0, 0, 0.2);

		.content {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			gap: global.$general-spacing-gap-action;
			height: 100%;
			&.icon-left {
				flex-direction: row-reverse;
			}
		}
		&.disabled {
			pointer-events: none;
		}

		&.icon {
			gap: global.$general-spacing-gap-action;
		}

		&.iconPosition-left {
			flex-direction: row-reverse;
		}
		&.iconPosition-right {
			flex-direction: row;
		}

		&.size-wide {
			width: 100%;
		}
		&.size-small {
			width: fit-content;
		}

		.pointer-none {
			pointer-events: none;
		}
	}

	.contained {
		&.variant-primary {
			--ripple-color: #{global.$color-ripple-inverted-pressed};
			background-color: $bg-contained-primary;
			color: global.$color-text-on-dark;
			&:hover {
				background-color: global.$color-action-primary-default;
			}
			&.disabled {
				background-color: global.$color-action-primary-disabled;
				color: global.$color-text-disabled;
			}

			&.toggle {
				background-color: global.$color-action-primary-default;
			}
		}

		&.variant-secondary {
			--ripple-color: #{global.$color-ripple-secondary-pressed};
			background-color: $bg-contained-secondary;
			color: $color-contained-secondary;
			&:hover {
				background-color: $bg-contained-secondary-hover;
			}
			&.toggle {
				background-color: $bg-contained-secondary-hover;
			}
		}

		&.variant-flat {
			--ripple-color: #{global.$color-ripple-secondary-pressed};
			justify-content: flex-end;
			background-color: transparent;
			color: $color-contained-secondary;
			box-shadow: unset;
			&:hover {
				background-color: global.$color-action-primary-hover;
			}
			&.toggle {
				background-color: global.$color-action-primary-hover;
			}
		}

		&.variant-sidebar {
			--ripple-color: #{global.$color-ripple-secondary-pressed};
			justify-content: flex-end;
			background-color: transparent;
			color: global.$color-text-on-dark;
			box-shadow: unset;
			padding-inline: 8px;
			&:hover {
				background-color: global.$color-background-action-on-dark-selected;
			}

			&.disabled {
				pointer-events: none;
			}
			&.toggle {
				background-color: global.$color-background-action-on-dark-selected;
			}
		}

		&.variant-icon {
			width: fit-content;
			background-color: $bg-contained-primary;
			color: global.$color-text-on-dark;
			box-shadow: unset;
			padding: 20px;

			&:hover {
				background-color: global.$color-action-primary-default;
			}
			&.disabled {
				background-color: global.$color-action-primary-disabled;
				color: global.$color-text-disabled;
			}
			&.toggle {
				background-color: global.$color-action-primary-default;
			}
		}
		&.variant-icon-outlined {
			width: fit-content;
			border: 1px solid global.$color-action-primary-default;
			color: global.$color-action-primary-default;
			background: transparent;
			box-shadow: unset;
			padding: 8px 12px;
			max-width: 32px;
			max-height: 32px;

			&:hover {
				background-color: global.$color-action-primary-hover;
			}
			&:disabled {
				background: transparent;
				border-color: global.$color-action-background-on-dark-disabled;
				color: global.$color-action-background-on-dark-disabled;
			}
			&.toggle {
				background-color: global.$color-action-primary-hover;
			}
		}
		&.variant-icon-only {
			width: fit-content;
			box-shadow: unset;
			padding: 8px 12px;
			max-width: 32px;
			max-height: 32px;

			&:hover {
				color: global.$color-action-primary-default;
			}
			&:disabled {
				background: transparent;
				color: global.$color-action-background-on-dark-disabled;
			}
			&.toggle {
				color: global.$color-action-primary-default;
			}
		}

		&.disabled {
			background-color: global.$color-action-primary-disabled;
			color: global.$color-text-disabled;
		}
	}
</style>
