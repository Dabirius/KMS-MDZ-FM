<script setup lang="ts">
	import type { MDZDocumentSelectorItem } from "../types/component-types";
	import { computed, ref } from "vue";
	import { useConfirmDialog } from "~/composables/useConfirmDialog";
	import { useFileUploadDialog } from "~/composables/useFileUploadDialog";
	import { useRenameDialog } from "~/composables/useRenameDialog";
	import { useDocuments } from "~/stores/api/documents";
	import { useChatscreen } from "~/stores/pages/chatscreen";
	import { SidebarEntry } from "./MDZSidebar.vue";

	export type MDZDocumentSelectorProps = {
		entity: SidebarEntry | "all" | undefined;
		modelValue?: MDZDocumentSelectorItem[];
		documents?: Array<MDZDocumentSelectorItem>;
	};

	const props = defineProps<MDZDocumentSelectorProps>();
	const emit = defineEmits<{
		(e: "update:modelValue", value: MDZDocumentSelectorItem): void;
		(e: "click:contextMenuDelete", value: MDZDocumentSelectorItem): void;
		(e: "click:contextMenuRename", value: MDZDocumentSelectorItem): void;
		(e: "click:addDocument"): void;
		(e: "trigger:delete", value: MDZDocumentSelectorItem): void;
	}>();

	const currentDoc = ref<MDZDocumentSelectorItem | undefined>();
	const showMenu = ref(false);
	const documentNamesList = ref("");
	const contextMenuCoordinates = ref<{ x: number; y: number }>();
	const chatStore = useChatscreen();
	const documentStore = useDocuments();
	const { selectedDocumentItem, documentLoading } = storeToRefs(chatStore);
	const {} = storeToRefs(documentStore);

	function handleDocumentClick(document: MDZDocumentSelectorItem) {
		emit("update:modelValue", document);
	}

	const isSelected = (id: number): boolean => {
		if (props.modelValue?.length === 0) {
			return false;
		}
		return props.modelValue?.some((docs) => docs.id === id) ?? false;
	};
	/**
	 * Asynchronous dialog-helper function calling a simple confirmation dialog
	 */
	const handleDeleteDocument = async (doc: MDZDocumentSelectorItem) => {
		if (
			await useConfirmDialog({
				title: "Löschen",
				description: descriptionText.value,
				confirmLabel: "Endgültig löschen",
				cancelLabel: "Nein, nicht löschen",
				valid: true,
			})
		) {
			chatStore.removeSelectedDocuments(doc);
			return;
		}
		console.info("Documents not removed. User cancelled the interaction.");
	};

	/**
	 * Constructs a String containing all selected documents, seperating with a comma (,) except
	 * for the last item, which will be connected with an ampersand (&)
	 */
	const getDocumentNamesListString = () => {
		const containsClickedItem =
			selectedDocumentItem.value.find(
				(doc) => doc.id === currentDoc.value?.id
			) && selectedDocumentItem.value.length !== 0;

		// if currentDoc has a value and selectedDocumentItem either doesn't contain currentDoc or other items
		if (currentDoc.value && !containsClickedItem) {
			documentNamesList.value = currentDoc.value?.name ?? "";
			return;
		}

		// currentDoc ist in selectedDocumentItem && selectedDocumentItem.length === 1
		if (selectedDocumentItem.value.length === 1) {
			documentNamesList.value = selectedDocumentItem.value[0].name;
			return;
		}
		// currentDoc ist in selectedDocumentItem && selectedDocumentItem.length > 1
		const names: string = selectedDocumentItem.value
			.map((doc) => doc.name)
			.join(", ");

		const lastIndex = names.lastIndexOf(",");

		documentNamesList.value =
			names.slice(0, lastIndex) +
			" &" +
			names.slice(lastIndex + 1, names.length);
	};

	/**
	 * Basically only chooses whether to use singular or plural version
	 */
	const descriptionText = computed(() => {
		getDocumentNamesListString();
		if (selectedDocumentItem.value.length === 1) {
			return `Soll ${documentNamesList.value} wirklich gelöscht werden?`;
		}
		return `Sollen ${documentNamesList.value} wirklich gelöscht werden?`;
	});

	const handleDocumentNew = async () => {
		if (await useFileUploadDialog()) return;

		console.info("Document upload cancelled by user. ");
	};

	const handleDocumentRename = async (doc: MDZDocumentSelectorItem) => {
		if (await useRenameDialog()) {
			chatStore.renameSelectedDocuments(doc);
			return;
		}
		console.info("Documents were not renamed. User cancelled the interaction.");
	};

	const isEmpty = computed(
		() => !props.documents || props.documents.length === 0
	);

	const entityName = computed(() => {
		if (chatStore.isSidebarEntry(props.entity)) return props.entity.label;
		return "Alle Dokumente";
	});

	watch(
		() => props.entity,
		() => {
			if (props.entity === "all") {
				chatStore.selectAllDocumentItems();
			}
		}
	);
	// eslint-disable-next-line no-undef
	onMounted(() => {
		if (!props.modelValue && props.documents) {
			emit("update:modelValue", props.documents[0]);
		}
	});
</script>

<template>
	<div class="document-selector-container">
		<div class="entity-name">
			{{ entityName }}
		</div>
		<div class="header">
			<span class="label">Dokumente</span>
			<MDZButton
				v-if="entity !== 'all'"
				variant="icon-outlined"
				type="outlined"
				@click="[handleDocumentNew(), emit('click:addDocument')]"
				icon="Plus"
				:icon-size="24"
			>
			</MDZButton>
		</div>
		<div class="document-list" v-if="!isEmpty">
			<MDZListItem
				v-for="doc in props.documents"
				id="menu-activator"
				:key="doc.id"
				:label="doc.name"
				:selected="isSelected(doc.id)"
				:checked="isSelected(doc.id)"
				@click="handleDocumentClick(doc)"
				@show:contextMenu="
					($event: MouseEvent) => [
						(showMenu = true),
						(currentDoc = doc),
						(contextMenuCoordinates = { x: $event.clientX, y: $event.clientY }),
					]
				"
				@contextmenu.prevent="
					($event: MouseEvent) => [
						(showMenu = true),
						(currentDoc = doc),
						(contextMenuCoordinates = { x: $event.clientX, y: $event.clientY }),
					]
				"
				@keyup.backspace="emit('trigger:delete', doc)"
			/>
			<MDZContextmenu
				title="Funktionen"
				:show="showMenu"
				:selectedDoc="modelValue"
				:location="contextMenuCoordinates"
				@click:delete="
					[
						handleDeleteDocument(currentDoc!),
						emit(
							'click:contextMenuDelete',
							currentDoc as MDZDocumentSelectorItem
						),
					]
				"
				@click:rename="
					[
						handleDocumentRename(currentDoc!),
						emit(
							'click:contextMenuRename',
							currentDoc as MDZDocumentSelectorItem
						),
					]
				"
				@hide="showMenu = false"
			>
			</MDZContextmenu>
		</div>
		<div class="empty-state" v-if="isEmpty">
			<img src="~/assets/images/documents-empty.svg" />
			<div class="description">
				<h6 class="title">Schritt 1:</h6>
				<p class="subtitle">
					Klicke auf das Plus Symbol und füge für diesen Ordner neue Dokumente
					hinzu. Dann kannst du über den Chat mit den Dokumenten interagieren.
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use "../assets/styles/global" as global;

	.dot-menu {
		display: flex;
		flex-direction: column;
		.menu-header {
			@include global.general-typography-text-menu();
			color: global.$color-text-on-secondary;
			padding-left: 24px;
			padding-bottom: 8px;
		}
	}

	.document-selector-container {
		height: 100%;
		.entity-name {
			@include global.general-typography-text-headline-h5;
			color: global.$color-text-primary;
			padding-top: 22px;
			padding-bottom: 32px;
			margin-top: 8px;
		}
		.header {
			display: flex;
			.label {
				flex: 1 0 auto;
				@include global.general-typography-text-headline-h6();
			}
		}
		.document-list {
			margin-top: 32px;
			overflow-y: auto;
			height: 100%;
		}
		.empty-state {
			text-align: center;
			img {
				width: 400px;
				height: 400px;
			}
			.description {
				color: global.$color-text-on-secondary;
				.title {
					@include global.general-typography-text-headline-h6();
				}
				.subtitle {
					@include global.general-typography-text-headline-subtitle();
					margin-top: 16px;
					margin-inline: auto;
					width: 55%;
				}
			}
		}
	}
</style>
