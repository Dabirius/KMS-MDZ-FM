import { useChat } from "~/stores/api/chat";

export const useChatPolling = defineStore("ChatPolling", () => {
  const entityId = ref<number | undefined | "all">(undefined);
  const intervalHandle = ref<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const chatStore = useChat();
  const waiting = ref<boolean>(false);

  function triggerPollingWithId(value: number | undefined | "all") {
    if (value === undefined) {
      _endPolling();
      return;
    }
    if (entityId.value === undefined) {
      entityId.value = value;
      _startPolling();
      return;
    }
    if (entityId.value !== value) {
      _endPolling();
      entityId.value = value;
      _startPolling();
      return;
    }
  }

  function _startPolling() {
    intervalHandle.value = setInterval(_poll, 1000);
    waiting.value = true;
  }

  async function _poll() {
    if (entityId.value === undefined) {
      return;
    }
    const messageResult: number | undefined =
      await chatStore.fetchNewestChatmessages(entityId.value);
    if (messageResult && messageResult > 0) {
      _endPolling();
    }
  }
  function _endPolling() {
    clearInterval(intervalHandle.value);
    intervalHandle.value = undefined;
    entityId.value = undefined;
    waiting.value = false;
  }

  return {
    triggerPollingWithId,
    waiting: readonly(waiting),
  };
});
