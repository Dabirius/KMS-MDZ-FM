import { MDZChatItemData } from "~/utils/types";
import { CChatMessage } from "~/types/db-types";

export function transformChatMessageToChatItem(
  value: CChatMessage,
): MDZChatItemData {
  return {
    content: value.message,
    answer: value.sender === "SYSTEM",
    subTitle: new Date(value.timestamp)
      .toLocaleDateString("de-DE")
      .concat(", ", new Date(value.timestamp).toLocaleTimeString()),
    relatedDocuments: value.relatedDocuments ?? [],
  };
}
