<template>
	<MDZNewDialog
		title="Neues Objekt"
		description="Bitte erfasse den Namen und weise eine/n Mitarbeiter/in zu."
		confirm-label="Anlegen"
		:valid="valid"
		@dialog:confirm="emit('dialog:confirm', entityName, currentAdvisor!.id)"
		:loading="loading"
	>
		<MDZTextfield v-model="entityName" label="Name *"></MDZTextfield>
		<MDZDropdown
			v-model="currentAdvisor"
			:options="options"
			label="Mitarbeiter *"
		></MDZDropdown>
	</MDZNewDialog>
</template>

<script setup lang="ts">
import { MDZDialogNewEntityResult } from "~/types/component-types";
import { computed, ref } from "vue";
import MDZTextfield from "./MDZTextfield.vue";
import MDZDropdown, { MDZDropdownOption } from "./MDZDropdown.vue";
import { useEntities } from "~/stores/api/entities";
import { useAdvisors } from "~/stores/api/advisor";

const store = useEntities();
const { loading } = storeToRefs(store);
const advisorStore = useAdvisors();
const entityName = ref<string>("");
const currentAdvisor = ref<MDZDropdownOption>();

const valid = computed(() => {
  return entityName.value !== "" && currentAdvisor.value !== undefined;
});

	const emit = defineEmits<{
		(e: "form-submit", data: MDZDialogNewEntityResult): void;
		(e: "dialog-closed"): void;
		(e: "dialog:confirm", name: string, id: number): void;
	}>();

const options = computed<MDZDropdownOption[]>(() => {
  return advisorStore.advisors.map(
    (advisor): MDZDropdownOption => ({
      id: advisor.id,
      value: `${advisor.firstName} ${advisor.lastName}`,
    }),
  );
});

const handleNewCustomer = async () => {
  await store.createEntity({
    name: entityName.value,
    advisorId: currentAdvisor.value?.id ?? null,
  });
};

onMounted(() => {
  advisorStore.fetchAdvisors();
});
</script>
