<script setup lang="ts">
	import { ref } from "vue";
	import MDZCheckbox from "./MDZCheckbox.vue";

	export type MDZListItemProps = {
		label: string;
		selected: boolean;
		checked?: boolean;
		large?: boolean;
		dataFields?: Array<string>;
	};

	const props = defineProps<MDZListItemProps>();
	const emit = defineEmits<{
		(e: "dot-menu-clicked"): void;
		(e: "checkbox-clicked"): void;
		(e: "show:contextMenu", value: MouseEvent): void;
	}>();

	const dotMenuClicked = ref(false);
</script>
<template>
	<button
		type="button"
		:class="{
			selected: props.selected,
			checked: props.checked || props.selected,
			'dot-menu-clicked': dotMenuClicked,
		}"
		@contextmenu.prevent
	>
		<div class="action-section">
			<MDZCheckbox
				class="checkbox"
				value="list-item-checkbox"
				:modelValue="props.checked"
				@update:modelValue="emit('checkbox-clicked')"
				@click="emit('checkbox-clicked')"
			/>
		</div>
		<span class="label" v-bind:title="label">{{ label }}</span>
		<span class="data-fields" v-if="props.dataFields && props.large">
			<span v-for="field in props.dataFields">
				{{ field }}
			</span>
		</span>
		<MDZIcons
			variant="secondary"
			icon-name="DotMenu"
			@click.stop="($event: MouseEvent) => emit('show:contextMenu', $event)"
		/>
	</button>
</template>

<style scoped lang="scss">
	@use "../assets/styles/global" as global;

	$bg-darker: rgba(255, 255, 255, 0.1);
	:deep(.menu-container) {
		min-width: 210px;
		background: global.$color-background-menu;
		border-radius: global.$general-size-radius-spec-container;
		box-shadow: 0px 3px 14px 2px #0000001f;
		padding: 8px;
	}
	button {
		@include global.general-typography-text-label();
		position: relative;
		height: 56px;
		padding: 0 4px 0 0;
		color: global.$color-pb-black;
		background-color: transparent;
		border-left: 4px solid transparent;
		border-top-right-radius: global.$general-size-radius-comp;
		border-bottom-right-radius: global.$general-size-radius-comp;
		display: flex;
		overflow: hidden;
		align-items: center;
		width: 100%;
		--ripple-color: #{global.$color-ripple-inverted-pressed};
		display: flex;
		overflow: hidden;
		> * {
			flex: 0 0 auto;
		}
		.checkbox {
			pointer-events: none;
		}

		.label {
			display: inline-block;
			overflow: hidden;
			flex: 1 1 auto;
			text-align: left;
			padding-right: 30px;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.data-fields {
			@include global.general-typography-text-body();
			color: global.$color-pb-grey;
			display: flex;
			gap: 30px;
			padding-right: 10px;
		}
		.dot-menu {
			display: flex;
			align-items: center;
			width: global.$general-size-height-icon-action-s;
			height: global.$general-size-height-icon-action-s;
			visibility: hidden;
			position: relative;
			--ripple-color: #{global.$color-pb-primary-orange-30};
			@include global.button-ripple(18px);
		}

		&:hover {
			background: global.$color-action-background-on-light-default;
			.checkbox {
				visibility: visible;
			}
			.pdf-icon {
				visibility: hidden;
			}
		}
		.action-section {
			position: relative;
			width: 40px;
			height: 40px;
			flex: 0 0 auto;
		}

		&.selected,
		&.checked {
			background: global.$color-background-action-on-light-selected;
			.dot-menu {
				color: global.$color-pb-primary-orange;
			}

			border-left: 4px solid global.$color-pb-black;
		}
		&.checked {
			.pdf-icon {
				visibility: hidden;
			}
			.checkbox {
				visibility: visible;
			}
		}
	}
</style>
