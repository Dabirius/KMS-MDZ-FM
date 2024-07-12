import { ref } from "vue";
import { ChatMessageItem } from "~/server/api/entities/[entityId]/chat/index.get";

export const useChat = defineStore("Chat", () => {
  const chatMessages = ref<Array<ChatMessageItem>>([]);

  function $reset() {
    chatMessages.value = [];
  }

  async function fetchAllChatmessages(entityId: number | "all"): Promise<void> {
    const { data } = await useFetch<Array<ChatMessageItem>>(
      `/api/entities/${entityId}/chat`,
    );
    chatMessages.value = data.value || [];
  }

  async function fetchNewestChatmessages(
    entityId: number | "all",
  ): Promise<number | undefined> {
    const newestChatmessageId = chatMessages.value?.at(-1)?.id;
    if (!newestChatmessageId) {
      return;
    }

    const { data } = await useFetch<Array<ChatMessageItem>>(
      `/api/entities/${entityId}/chat`,
      {
        params: {
          messagesNewerThanId: newestChatmessageId,
        },
      },
    );

    if (data && data.value && data.value?.length && data.value?.length > 0) {
      chatMessages.value.push(...data.value);
      return 1;
    } else {
      return -1;
    }
  }

  async function postNewChatmessage(
    entityId: number | "all",
    message: string,
    relatedDocuments?: Array<number>,
  ): Promise<number> {
    const { data } = await useFetch<ChatMessageItem>(
      `/api/entities/${entityId}/chat`,
      {
        method: "POST",
        body: {
          message: message,
          sender: "ADVISOR",
          relatedDocuments: relatedDocuments || [],
        },
      },
    );
    if (data && data.value) {
      chatMessages.value.push(data.value);
      return data.value?.id;
    } else {
      return -1;
    }
  }

  return {
    chatMessages,
    $reset,
    fetchAllChatmessages,
    fetchNewestChatmessages,
    postNewChatmessage,
  };
});
