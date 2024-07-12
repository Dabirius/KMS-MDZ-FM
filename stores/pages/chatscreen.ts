import { defineStore } from "pinia";
import { useDocuments } from "../api/documents";
import { EntityNew, useEntities } from "../api/entities";
import { SidebarEntry } from "../../components/MDZSidebar.vue";
import { computed, readonly, ref } from "vue";
import { useChat } from "~/stores/api/chat";
import { useChatPolling } from "~/stores/api/polling";

import { useAdvisors } from "~/stores/api/advisor";
import { MDZDropdownOption } from "~/components/MDZDropdown.vue";
import {
  MDZDialogNewEntityResult,
  MDZDocumentSelectorItem,
} from "~/types/component-types";
import { CChatMessage, CDocument, CEntity } from "~/types/db-types";
import { transformChatMessageToChatItem } from "~/utils/misc";
import { MDZChatItemData } from "~/utils/types";
import { MDZDialogNewDocumentResult } from "~/components/MDZDialogNewDocument.vue";

export const useChatscreen = defineStore("Chatscreen", () => {
  const documentStore = useDocuments();
  const entityStore = useEntities();
  const advisorStore = useAdvisors();
  const chatStore = useChat();
  const pollingStore = useChatPolling();

  const { entities: StoreEntities } = storeToRefs(entityStore);

  const sidebarEntries = ref<Array<SidebarEntry>>([]);
  const selectedSidebarEntry = ref<SidebarEntry | undefined | "all">(undefined);
  const currentDocuments = ref<ReadonlyArray<CDocument>>([]);
  const selectedDocumentItems = ref<MDZDocumentSelectorItem[]>([]);
  const actionItem = ref<MDZDocumentSelectorItem>();

  const chatContainerItems = computed<Array<MDZChatItemData>>(() => {
    return (chatStore.chatMessages as Array<CChatMessage>).map(
      transformChatMessageToChatItem,
    );
  });

  const localCustomerInformation = ref<MDZDialogNewEntityResult>();

  const dialogNewEntityOpened = ref<boolean>(false);
  const dialogNewDocumentOpened = ref<boolean>(false);
  const dialogRenameDocumentOpened = ref<boolean>(false);
  const dialogDeleteDocumentOpened = ref<boolean>(false);

  const deleteDocumentLoading = ref<boolean>(false);

  const dialogNewDocumentLoading = ref<boolean>(false);
  const dialogNewDocumentDoc = ref<MDZDialogNewDocumentResult>();

  const dialogRenameDocumentNewName = ref<string>("");

  const chatDisabled = computed<boolean>(() => {
    return !currentDocuments.value || currentDocuments.value.length === 0;
  });

  const chatInteractionDisabled = computed<boolean>(() => {
    return (
      !currentDocuments.value ||
      currentDocuments.value.length === 0 ||
      selectedDocumentItems.value === undefined ||
      selectedDocumentItems.value.length === 0
    );
  });

  function isSidebarEntry(value: any): value is SidebarEntry {
    return value !== undefined && value !== 'all';
  }

  const advisorOptions = computed<Array<MDZDropdownOption>>(() => {
    return advisorStore.advisors.map((a): MDZDropdownOption => {
      return {
        id: a.id,
        value: `${a.lastName}, ${a.firstName}`,
      };
    });
  });

  async function init() {
    await fillSidebar();
    selectedSidebarEntry.value = sidebarEntries.value.at(0);

    // make sure to select also the first sidebar entry to show the related documents
    if (selectedSidebarEntry.value) {
      selectSidebarEntry(selectedSidebarEntry.value);
    }
  }

  async function fillSidebar(filterString?: string) {
    await entityStore.fetchEntities(filterString);
    sidebarEntries.value = transformEntitiesToSidebarEntries(
      StoreEntities.value,
    );
  }

  async function selectSidebarEntry(entry: SidebarEntry | "all") {
    selectedDocumentItems.value = [];
    selectedSidebarEntry.value = entry;
    await fillDocumentSelector();
    await chatStore.fetchAllChatmessages(isSidebarEntry(entry) ? entry.id : "all");
  }

  function transformEntitiesToSidebarEntries(
    entities: Readonly<Array<CEntity>>,
  ): Array<SidebarEntry> {
    return entities.map((e) => {
      return {
        id: e.id,
        label: `${e.name}`,
      };
    });
  }
  async function fillDocumentSelector() {
    if (selectedSidebarEntry.value === undefined) {
      return;
    }
    const entityId = isSidebarEntry(selectedSidebarEntry.value) ? selectedSidebarEntry.value.id : "all";

    await documentStore.fetchDocuments(entityId);
    currentDocuments.value = documentStore.documents;
  }

  async function fetchSidebarEntriesWithFilter(filterString: string) {
    await fillSidebar(filterString);
  }

  async function startDialogNewEntity() {
    await advisorStore.fetchAdvisors();
    dialogNewEntityOpened.value = true;
  }

  async function endDialogNewEntity(result?: MDZDialogNewEntityResult) {
    const data = result ? result : localCustomerInformation.value;
    if (data) {
      const newEntity: EntityNew = {
        name: data.name,
        advisorId: data.advisorId === undefined ? null : data.advisorId,
      };
      const created = await entityStore.createEntity(newEntity);
      sidebarEntries.value = transformEntitiesToSidebarEntries(
        entityStore.entities,
      );
      if (created) {
        const createdSidebarEntry = sidebarEntries.value.find(
          (s) => s.id === created.id,
        );

        //added check for undefined to match type
        if (createdSidebarEntry) {
          await selectSidebarEntry(createdSidebarEntry);
        }
      }
    }
    dialogNewEntityOpened.value = false;
  }

  function selectDocumentItem(value: MDZDocumentSelectorItem) {
    const position = selectedDocumentItems.value.findIndex(
      (doc) => doc.id === value.id,
    );

    if (position !== -1) {
      selectedDocumentItems.value.splice(position, 1);
      return;
    }
    selectedDocumentItems.value.push(value);
  }

  async function selectAllDocumentItems () {
    await fillDocumentSelector();
    selectedDocumentItems.value = [...currentDocuments.value];
  }

  function setUploadDocument(doc: MDZDialogNewDocumentResult) {
    dialogNewDocumentDoc.value = doc;
  }

  async function uploadSelectedDocuments() {
    dialogNewDocumentLoading.value = true;

    if (dialogNewDocumentDoc.value?.document && selectedSidebarEntry.value && isSidebarEntry(selectedSidebarEntry.value)) {
      await documentStore.createDocument(
        selectedSidebarEntry.value.id,
        dialogNewDocumentDoc.value.document,
        dialogNewDocumentDoc.value.newFilename,
      );
    }

    dialogNewDocumentDoc.value = undefined;
    dialogNewDocumentOpened.value = false;
    dialogNewDocumentLoading.value = false;
  }

  function setRenameDocumentString(newName: string) {
    dialogRenameDocumentNewName.value = newName;
  }

  async function renameSelectedDocuments(doc: MDZDocumentSelectorItem) {
    if (
      !dialogRenameDocumentNewName.value ||
      dialogRenameDocumentNewName.value === ""
    ) {
      return;
    }

    if (!selectedSidebarEntry.value || !isSidebarEntry(selectedSidebarEntry.value)) {
      return;
    }

    await documentStore.renameDocument(
      selectedSidebarEntry.value.id,
      doc.id ?? 0,
      dialogRenameDocumentNewName.value,
    );
  }

  function startDialogDeleteDocument(doc: MDZDocumentSelectorItem) {
    actionItem.value = doc;
    dialogDeleteDocumentOpened.value = true;
  }

  async function removeSelectedDocuments(doc?: MDZDocumentSelectorItem) {
    if (!doc && !selectedDocumentItems.value) {
      return;
    }
    const requestCollection: Promise<void>[] = [];
    const documentCollection: MDZDocumentSelectorItem[] = [];

    deleteDocumentLoading.value = true;

    // doc is selected but selectedDocumentItems is empty or doesn't contain doc
    if (
      doc &&
      (selectedDocumentItems.value.length === 0 ||
        !selectedDocumentItems.value.find((item) => item.id === doc.id))
    ) {
      documentCollection.push(doc);
    }
    // doc is selected and selectedDocumentItems contains doc
    if (doc && selectedDocumentItems.value.find((item) => item.id === doc.id)) {
      documentCollection.push(...[...selectedDocumentItems.value, doc]);
    }
    documentCollection.forEach(async (doc) => {
      requestCollection.push(
        documentStore.deleteDocument(selectedSidebarEntry.value!.id, doc.id),
      );
    });

    await Promise.all(requestCollection);
    deleteDocumentLoading.value = false;
    selectedDocumentItems.value = [];
  }

  async function handleChatMessageSent(message: string) {
    if (!selectedSidebarEntry.value) {
      return;
    }
    if (!selectedDocumentItems.value) {
      return;
    }
    const relatedDocuments = selectedDocumentItems.value.map((doc) => doc.id);
    const newestChatMessageId: number = await chatStore.postNewChatmessage(
      isSidebarEntry(selectedSidebarEntry.value) ? selectedSidebarEntry.value.id : "all",
      message,
      relatedDocuments,
    );
    if (newestChatMessageId && newestChatMessageId > 0) {
      // start polling for system answer
      pollingStore.triggerPollingWithId(isSidebarEntry(selectedSidebarEntry.value) ? selectedSidebarEntry.value.id : "all");
    }
  }

  return {
    selectedSidebarEntry,
    selectSidebarEntry,
    fetchSidebarEntriesWithFilter,
    sidebarEntries: readonly(sidebarEntries),
    waitingForResponse: pollingStore.waiting,
    documentLoading: readonly(dialogNewDocumentLoading),
    currentDocuments,
    selectedDocumentItem: selectedDocumentItems,
    selectDocumentItem,
    selectAllDocumentItems,
    chatContainerItems,
    handleChatMessageSent,
    dialogNewEntityOpened,
    dialogNewDocumentOpened,
    dialogRenameDocumentOpened,
    dialogDeleteDocumentOpened,
    startDialogNewEntity,
    endDialogNewEntity,
    uploadSelectedDocuments,
    setUploadDocument,
    renameSelectedDocuments,
    setRenameDocumentString,
    startDialogDeleteDocument,
    removeSelectedDocuments,
    deleteDocumentLoading: readonly(deleteDocumentLoading),
    chatDisabled,
    chatInteractionDisabled,
    advisorOptions,
    init,
    fillSidebar,
    isSidebarEntry,
  };
});
