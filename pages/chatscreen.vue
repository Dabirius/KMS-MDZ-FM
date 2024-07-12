<template>
	<nuxt-layout name="chatscreen">
		<template #sidebar>
			<MDZSidebar
				:selectedEntry="store.selectedSidebarEntry"
				:data="store.sidebarEntries"
				@trigger:search="store.fetchSidebarEntriesWithFilter($event)"
				@selected:entry="(event) => store.selectSidebarEntry(event)"
			></MDZSidebar>
		</template>
		<template #content>
			<div
				class="documents-and-chat"
				:class="{ 'chat-disabled': store.chatDisabled }"
			>
				<div class="document-selector">
					<MDZDocumentSelector
						:entity="store.selectedSidebarEntry"
						:documents="store.currentDocuments"
						:model-value="store.selectedDocumentItem"
						@update:model-value="store.selectDocumentItem($event)"
						@trigger:delete="removeItem"
					/>
				</div>
				<div class="chat">
					<MDZChatContainer
						:items="store.chatContainerItems"
						:chatDisabled="store.chatDisabled"
						:chatInteractionDisabled="store.chatInteractionDisabled"
						:loading="waiting"
						@message:sent="store.handleChatMessageSent($event)"
					></MDZChatContainer>
				</div>
			</div>
		</template>
		<template #dialogs> </template>
	</nuxt-layout>
</template>

<script setup lang="ts">
	import { useChatPolling } from "~/stores/api/polling";
	import { MDZDocumentSelectorItem } from "~/types/component-types";
	import MDZDialogNewCustomer from "../components/MDZDialogNewCustomer.vue";
	import { useChatscreen } from "../stores/pages/chatscreen";
	import { SidebarEntry } from "~/components/MDZSidebar.vue";
	import { useNewCustomerDialog } from "~/composables/useNewCustomerDialog";

	const store = useChatscreen();
	const pollStore = useChatPolling();
	// eslint-disable-next-line no-undef
	const { waiting } = storeToRefs(pollStore);

	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case "Backspace":
				if (
					document.activeElement?.id === "input-2" ||
					!store.selectDocumentItem
				) {
					break;
				}
				removeItem(store?.selectedDocumentItem);
				break;
		}
	};

	const removeItem = (item: MDZDocumentSelectorItem | undefined) => {
		if (!item) {
			return;
		}

		store.startDialogDeleteDocument(item);
	};

	await store.init();
	// eslint-disable-next-line no-undef
	onMounted(async () => {
		window.addEventListener("keydown", handleKeyDown);
	});
</script>

<style scoped lang="scss">
	@use "../assets/styles/global" as global;

	.documents-and-chat {
		padding-left: 24px;
		display: flex;
		background-color: global.$color-background-main;
		height: 100%;

		.document-selector {
			width: min(33vw, 600px);
			flex: 1 1 0;
		}
		.chat {
			flex: 1 1 0;
			margin: 20px;
			background-color: global.$color-background-chat;
			border-radius: global.$general-size-radius-spec-container;
			min-width: 0;
		}
	}
</style>
