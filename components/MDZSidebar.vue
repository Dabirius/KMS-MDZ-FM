<template>
	<div class="sidebar-container">
		<div class="top">
			<div class="heading">Objekte</div>
			<MDZButton
				variant="sidebar"
				label="Alle Objekte"
				icon="LibraryBooks"
				icon-position="left"
				@click="handleAllObjects()"
				:toggle="activeEntity === 'all'"
			/>
			<div class="searchbar">
				<MDZSearchbar
					:dark="true"
					v-model="searchbarValue"
					@keyup="handleSearchbarEnter"
					placeholder="Suchen"
				></MDZSearchbar>
			</div>
		</div>
		<div class="middle">
			<div class="list-folder">
				<MDZListFolder
					@click="handleListFolderClick"
					color="sidebar"
					size="large"
					label="Alle Objekte"
					:open="listIsOpened"
				/>
				<MDZListItemFolder
					v-for="element in props.data"
					@click="handleListItemClick(element)"
					class="list-element"
					:label="element.label"
					:selected="element.id === props.selectedEntry?.id"
					:show-menu="true"
					@click:menu="
						($event: MouseEvent) => [
							(showMenu = true),
							(currentDoc = element),
							(contextMenuCoordinates = {
								x: $event.clientX,
								y: $event.clientY,
							}),
						]
					"
					@contextmenu.prevent="
						($event: MouseEvent) => [
							(showMenu = true),
							(currentDoc = element),
							(contextMenuCoordinates = {
								x: $event?.clientX,
								y: $event?.clientY,
							}),
						]
					"
				/>
			</div>
		</div>
		<div class="bottom">
			<div class="bottom-button">
				<MDZButton
					variant="primary"
					label="Neues Objekt"
					size="wide"
					icon="Plus"
					@click="handleNewCustomer()"
				/>
			</div>
			<div class="logo">
				<img src="~/assets/images/logo_mdz.svg" />
			</div>
		</div>
	</div>
	<MDZContextmenu
		title="Funktionen"
		:show="showMenu"
		:location="contextMenuCoordinates"
		@click:delete="handleDelete()"
		@click:rename="handleRename"
		@hide="showMenu = false"
	>
	</MDZContextmenu>
</template>

<script setup lang="ts">
	import MDZSearchbar from "./MDZSearchbar.vue";
	import MDZListItemFolder from "./MDZListItemFolder.vue";
	import MDZListFolder from "./MDZListFolder.vue";
	import { ref } from "vue";
	import { useChatscreen } from "~/stores/pages/chatscreen";
	import { useEntities } from "~/stores/api/entities";
	export type SidebarEntry = {
		id: number;
		label: string;
		selected?: boolean;
	};
	export type MDZSearchbarProps = {
		data: Array<SidebarEntry>;
		selectedEntry?: SidebarEntry | "all";
	};

	const props = defineProps<MDZSearchbarProps>();
	const emit = defineEmits<{
		(e: "selected:entry", entry: SidebarEntry | "all"): void;
		(e: "click:newCustomer"): void;
		(e: "trigger:search", searchbarValue: string): void;
		(e: "click:contextMenuDelete", value: SidebarEntry): void;
		(e: "click:contextMenuRename", value: SidebarEntry): void;
	}>();

	const activeEntity = ref<SidebarEntry | "all" | undefined>();

	const listIsOpened = ref<boolean>(true);
	const transitionRunning = ref<boolean>(false);
	const searchbarValue = ref("");

	const currentDoc = ref<SidebarEntry | undefined>();
	const showMenu = ref(false);
	const contextMenuCoordinates = ref<{ x: number; y: number }>();
	const chatStore = useChatscreen();
	const entityStore = useEntities();

	function handleListFolderClick(): void {
		listIsOpened.value = !listIsOpened.value;
		transitionRunning.value = true;
	}

	function handleListItemClick(element: SidebarEntry): void {
		activeEntity.value = element;
		emit("selected:entry", element);
	}

	const handleAllObjects = () => {
		activeEntity.value = "all";
		emit("selected:entry", "all");
	};

	function handleSearchbarEnter(): void {
		emit("trigger:search", searchbarValue.value);
	}

	const handleDelete = async () => {
		if (
			await useConfirmDialog({
				title: "Objekt löschen?",
				description: "Wollen Sie das Objekt wirklich löschen?",
				confirmLabel: "Bestätigen",
				cancelLabel: "Abbrechen",
			})
		) {
			await entityStore.removeEntity(currentDoc.value?.id);
			await chatStore.fillSidebar();
			handleListItemClick(props.data[0]);
		}
	};

	const handleRename = async () => {
		if (await useRenameEntityDialog(currentDoc.value?.id)) {
			await chatStore.fillSidebar();
		}
	};

	const handleNewCustomer = async () => {
		if (await useNewCustomerDialog()) {
			await chatStore.fillSidebar();
		}
	};
</script>

<style scoped lang="scss">
	@use "../assets/styles/global" as global;

	.sidebar-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 300px;
		gap: 32px;
		padding: 8px;
		padding-bottom: 20px;
		border-radius: 0px global.$general-size-radius-spec-container
			global.$general-size-radius-spec-container 0px;
		color: global.$color-pb-white;
		background-color: global.$color-background-panel;

		.top {
			display: flex;
			flex-direction: column;
			flex: 0 0 auto;
			gap: 32px;

			.heading {
				@include global.general-typography-text-headline-h5();
				padding: 22px 12px 0px 12px;
			}
			.searchbar {
				MDZSearchbar {
					width: 100%;
				}
			}
		}
		.middle {
			flex: 1 1 auto;
			min-height: 0;
			display: flex;
			flex-direction: column;
			color-scheme: dark;
			.list-folder {
				overflow-y: auto;
				padding-bottom: 22px;
				padding-left: 12px;
				&::after {
					content: "";
					display: none;
					position: sticky;
					background: linear-gradient(
						transparent,
						global.$color-background-panel
					);
					bottom: -22px;
					height: 16px;
					width: 200px;
				}
			}

			.list-collapsable {
				height: 100%;
				transition: height 1s ease-in-out;
				overflow: scroll;
				color-scheme: dark;
				padding-right: 8px;

				&.overflow-scroll {
					overflow-y: scroll;
				}
				&.collapsed {
					height: 0;
					overflow-y: hidden;
				}
				.list-element:not(:last-of-type) {
					padding-bottom: 22px;
				}

				.fadeout-bottom,
				.fadeout-top {
					position: absolute;
					left: 0;
					right: 0;
					height: 64px;
					pointer-events: none;
				}

				.fadeout-bottom {
					bottom: 0;
					transform-origin: bottom;
					background: linear-gradient(0, currentColor, transparent);
				}

				.fadeout-top {
					top: 0;
					height: 64px;
					transform-origin: top;
					background: linear-gradient(0, transparent, currentColor);
				}
				&.testheight {
					height: 300px !important;
				}
			}
		}

		.bottom {
			flex: 0 0 auto;
			.bottom-button {
				padding-bottom: 22px;
			}
			.logo {
				padding: 0px 12px;
				text-align: center;
				overflow: hidden;
				img {
					max-width: 100%;
					width: auto;
					height: 40px;
				}
			}
		}
	}
</style>
