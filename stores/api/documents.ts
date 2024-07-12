import { Document as PrismaDocument } from "@prisma/client";
import { defineStore } from "pinia";
import { readonly, ref } from "vue";
import { CDocumenttype } from "~/types/db-types";

export const useDocuments = defineStore("Documents", () => {
  const documents = ref<Array<PrismaDocument>>([]);

  function $reset() {
    documents.value = [];
  }
  function _renameInStore(id: number, newName: string) {
    const docIndex = documents.value.findIndex((d) => d.id === id);
    if (docIndex > -1) {
      documents.value.at(docIndex)!.name = newName;
    }
  }

  function _deleteInStore(id: number) {
    const docIndex = documents.value.findIndex((d) => d.id === id);
    if (docIndex > -1) {
      documents.value.splice(docIndex, 1);
    }
  }
  async function fetchDocuments(entityId: number | "all"): Promise<void> {
    const { data } = await useFetch<Array<PrismaDocument>>(
      `/api/entities/${entityId}/documents`,
    );
    documents.value = data.value || [];
  }

  async function createDocument(
    entityId: number,
    file: File,
    newFileName?: string,
  ) {
    const formData = new FormData();
    if (newFileName) {
      formData.append("name", newFileName);
    }
    formData.append("file", file, file.name);
    formData.append("type", CDocumenttype.DOCUMENT);

    const { data } = await useFetch(`/api/entities/${entityId}/documents`, {
      method: "POST",
      body: formData,
    });
    if (data && data.value) {
      documents.value.push(data.value);
    }
  }

  async function renameDocument(
    entityId: number,
    documentId: number,
    newName: string,
  ) {
    const { data } = await useFetch(
      `/api/entities/${entityId}/documents/${documentId}`,
      {
        method: "POST",
        body: {
          name: newName,
        },
      },
    );
    if (data && data.value) {
      _renameInStore(documentId, newName.concat(".pdf"));
    }
  }

  async function deleteDocument(entityId: number, documentId: number) {
    const { data } = await useFetch(
      `/api/entities/${entityId}/documents/${documentId}`,
      {
        method: "DELETE",
      },
    );
    if (data) {
      _deleteInStore(documentId);
    }
  }
  return {
    $reset,
    fetchDocuments,
    createDocument,
    renameDocument,
    deleteDocument,
    documents: readonly(documents),
  };
});
