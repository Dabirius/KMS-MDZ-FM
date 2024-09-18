<template>
	<div class="item-container" :class="{ answer: props.answer }">
		<div class="chat-item">
			<div class="content" v-html="content"></div>
			<div v-if="subTitle" class="subtitle">
				{{ subTitle }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps<{
		content: string;
		answer: boolean;
		subTitle?: string;
	}>();
</script>

<style scoped lang="scss">
	@use "../assets/styles/global" as global;
	.item-container {
		display: flex;
		justify-content: flex-end;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		.chat-item {
			display: flex;
			flex-direction: column;
			width: fit-content;
			max-width: 100%;
			.content {
				@include global.general-typography-text-label;
				border-radius: global.$general-size-radius-comp;
				background-color: global.$color-pb-light-grey;
				padding: 16px global.$general-spacing-padding-formComp-s-hor;
				color: global.$color-pb-black;
				text-align: right;
				hyphens: auto;
				word-break: break-word;
				list-style-position: inside;
			}

			.subtitle {
				@include global.general-typography-text-formComp-helper;
				color: global.$color-light-text-helper;
				text-align: right;
				padding: 2px global.$general-spacing-padding-formComp-s-hor 0;
			}
		}
		&.answer {
			justify-content: start;
			.chat-item {
				.content {
					text-align: left;
					border: 1px solid global.$color-pb-primary-orange;
					background-color: transparent;
				}
				.subtitle {
					text-align: left;
				}
			}
		}
	}
	.empty-element {
		min-width: 50px;
		flex: 1 1 auto;
	}
</style>
