import { CDocument } from "~/types/db-types";

export type MDZChatItemData = {
  content: string;
  answer: boolean;
  subTitle: string | undefined;
  relatedDocuments: Array<Pick<CDocument, "uuid" | "id" | "name">>;
  isSeparator?: boolean;
};
