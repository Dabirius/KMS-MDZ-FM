<script setup lang="ts">
	import MDZTextfield from "~/components/MDZTextfield.vue";
	import { ref, computed } from "vue";
	import { useChatscreen } from "~/stores/pages/chatscreen";

	export type MDZDialogNewDocumentResult = {
		newFilename: string | undefined;
		document: File | null;
	};

	defineProps<{
		loading?: boolean;
	}>();

	const emit = defineEmits<{
		(e: "upload:finished"): void;
	}>();

	const chatStore = useChatscreen();
	const { documentLoading } = storeToRefs(chatStore);
	const fileinput = ref<HTMLInputElement | null>(null);
	const newFileName = ref<string>("");
	const currentFilename = ref<string>("");

	const formValid = computed(() => {
		return currentFilename.value !== "";
	});

	function handleFileInput(): void {
		if (
			fileinput.value !== null &&
			fileinput.value.files &&
			fileinput.value.files.length > 0
		) {
			currentFilename.value = "";
			if (fileinput.value?.files === undefined) {
				return;
			}
			currentFilename.value = fileinput!.value!.files!.item(0)!.name;
		}
	}

	const handleConfirm = async () => {
		if (!fileinput?.value?.files?.item(0)) return;

		chatStore.setUploadDocument({
			newFilename: fileName.value,
			document: fileinput?.value?.files?.item(0),
		});

		await chatStore.uploadSelectedDocuments();
		emit("upload:finished");
	};

	const fileName = computed(() => {
		return (
			newFileName.value !== "" ? newFileName.value : currentFilename.value
		).replace(/(.pdf)+/, "");
	});
</script>

<template>
	<MDZNewDialog
		title="Neues Dokument"
		description="Bitte lade das Dokument als PDF hier hoch."
		confirm-label="Bestätigen"
		cancel-label="Abbrechen"
		:loading="documentLoading"
		:valid="formValid"
		@dialog:confirm="handleConfirm()"
	>
		<input
			type="file"
			style="display: none"
			ref="fileinput"
			accept="application/pdf"
			@change="handleFileInput"
		/>
		<div class="new-document-dialog-content">
			<MDZTextfield
				v-model="currentFilename"
				:showActionButton="true"
				:readonly="true"
				@click:actionButton="fileinput?.click()"
				hint="Maximale Dateigröße 10MB"
				label="Datei hinzufügen oder hier ablegen."
				icon-name="FileUploadOutline"
				:icon-size="24"
			>
			</MDZTextfield>
			<div class="empty-space pt-4"></div>
			<MDZTextfield
				v-model="newFileName"
				label="Name"
				hint=".pdf"
				:hint-align-right="true"
			></MDZTextfield>
		</div>
	</MDZNewDialog>
</template>

<style scoped lang="scss">
	.empty-space {
		width: 100%;
	}
</style>
