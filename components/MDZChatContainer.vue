<template>
	<div class="container">
		<div
			class="chat-window"
			v-if="!(isEmpty || props.chatDisabled)"
			ref="divScrollContainer"
		>
			<v-virtual-scroll
				ref="virtualScroller"
				class="virtual-scroll chat"
				height="100%"
				:items="items"
			>
				<template v-slot:default="{ item, index }">
					<div
						v-if="
							index <= 0 ||
							JSON.stringify(item.relatedDocuments) !==
								JSON.stringify(items.at(index - 1)?.relatedDocuments)
						"
						class="chat-section-divider"
					>
						<div class="chat-section-title">
							{{
								item.relatedDocuments && item.relatedDocuments.length > 0
									? item.relatedDocuments
											?.map((doc) => doc.name)
											.toString()
											.replace(",", " / ")
									: "[Dokument(e) gelöscht]"
							}}
						</div>
					</div>
					<MDZChatItem
						v-if="!item.isSeparator"
						class="chat-item-component"
						:content="item.content"
						:answer="item.answer"
						:subTitle="item.subTitle"
					>
					</MDZChatItem>
					<span v-if="item.loading">Tippt ...</span>
				</template>
			</v-virtual-scroll>
		</div>
		<div class="empty-state" v-if="isEmpty && !props.chatDisabled">
			<img src="~/assets/images/chat-empty.svg" />
			<div class="description">
				<h6 class="title">Schritt 2:</h6>
				<p class="subtitle">
					Interagiere mit dem Dokument und stelle eine Frage über die Chat
					Funktion.
				</p>
			</div>
		</div>
		<div class="disabled-state" v-if="props.chatDisabled">
			<div class="disabled-state__inner">
				<img src="~/assets/images/chat-disabled.svg" />
				<h6 class="title">Schritt 2</h6>
			</div>
		</div>
		<div class="input-section" ref="divInputSection">
			<MDZTextfield
				@keydown.enter="handleSendRequest"
				v-model="textfieldValue"
				:disabled="props.chatDisabled || props.chatInteractionDisabled"
				@click:actionButton="handleSendRequest"
				icon-name="Send"
				placeholder="Stelle eine Frage"
			>
			</MDZTextfield>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, watch } from "vue";
	import type { MDZChatItemData } from "~/utils/types";
	import { VVirtualScroll } from "vuetify/components";

	interface MDZChatItemDataExtended extends MDZChatItemData {
		loading: boolean;
	}

	export type MDZChatContainerProps = {
		items: Array<MDZChatItemDataExtended>;
		newItem?: MDZChatItemData;
		chatDisabled?: boolean;
		chatInteractionDisabled?: boolean;
		loading?: boolean;
	};

	const props = defineProps<MDZChatContainerProps>();
	const emit = defineEmits<{
		(e: "message:sent", p: string): void;
	}>();

	const virtualScroller = ref<VVirtualScroll | null>(null);
	const textfieldValue = ref("");
	const divScrollContainer = ref<HTMLElement>();
	const divInputSection = ref(null);
	const observer = ref<ResizeObserver>();

	const isEmpty = computed(() => {
		return props.items.length === 0;
	});

	function scrollToLatest(): void {
		setTimeout(() => {
			virtualScroller.value?.$el.dispatchEvent(new Event("scroll"));
			virtualScroller.value?.scrollToIndex(
				virtualScroller.value?.items.length - 1
			);
			setTimeout(() => {
				// Additional verification to show last element in viewport fully
				const x =
					divScrollContainer.value
						?.querySelector(".chat")
						?.querySelectorAll(".v-virtual-scroll__item") ?? [];
				if (x && x.length > 0) {
					x[x.length - 1].scrollIntoView({
						behavior: "smooth",
						block: "end",
						inline: "nearest",
					});
				}
			}, 100);
		}, 300);
	}
	function handleSendRequest(): void {
		if (!textfieldValue.value) {
			return;
		}

		emit("message:sent", textfieldValue.value);
		textfieldValue.value = "";
	}

	onMounted(() => {
		observer.value = new ResizeObserver(scrollToLatest);
		if (!divScrollContainer.value) {
			return;
		}

		observer.value.observe(divScrollContainer.value!);
		if (!props.items) {
			return;
		}
		scrollToLatest();
	});

	watch(
		() => props.items,
		() => {
			virtualScroller.value?.$forceUpdate();
			nextTick(() => scrollToLatest());
		},
		{ deep: true, immediate: true }
	);

	watch(
		() => props.loading,
		() => {
			if (props.items.length === 0) {
				return;
			}

			props.items[props.items.length - 1].loading = props.loading ?? false;
			if (props.items[props.items.length - 2]) {
				props.items[props.items.length - 2].loading = false;
			}

			virtualScroller.value?.$forceUpdate();
			nextTick(() => scrollToLatest());
		}
	);
</script>

<style scoped lang="scss">
	@use "../assets/styles/global" as global;

	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		.chat-window {
			padding: 24px;
			display: flex;
			flex-direction: column;
			flex: 1 1 auto;
			height: 100%;
			overflow: hidden;

			.virtual-scroll {
				padding-right: 16px;
				overflow-x: hidden;

				.chat-item-component {
					padding-bottom: 16px;
				}
			}
		}
		.empty-state {
			text-align: center;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			img {
				max-width: 400px;
				max-height: 400px;
			}
			.description {
				color: global.$color-text-on-secondary;
				.title {
					@include global.general-typography-text-headline-h6();
				}
				.subtitle {
					@include global.general-typography-text-headline-subtitle();
					margin-top: 16px;
					width: 45%;
					margin-inline: auto;
				}
			}
		}
		.disabled-state {
			text-align: center;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;
			overflow: hidden;
			&__inner {
				overflow: hidden;
				height: 100%;
				display: flex;
				flex-direction: column;
				margin-top: 115px;
			}
			.title {
				@include global.general-typography-text-headline-h6();
				color: global.$color-pb-light-grey;
			}

			img {
				width: 400px;
				height: 400px;
        aspect-ratio: 1;
			}
		}
		.input-section {
			padding: 0 24px;
			flex: 0 0 auto;
		}

		.chat-section-divider {
			border-top: 1px solid global.$color-text-chat;
			gap: 48px;
		}
		.chat-section-title {
			color: global.$color-text-chat;
			white-space: nowrap;
			overflow: hidden;
			max-width: 100%;
			text-overflow: ellipsis;
			padding: 24px 0;
			margin-top: 12px;
		}
	}
</style>
