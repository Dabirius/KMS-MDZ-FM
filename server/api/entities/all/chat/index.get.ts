import { ChatMessage, Prisma } from "@prisma/client";
import { defineEventHandler } from "h3";
import { QueryObject } from "ufo";
import ChatMessageWhereInput = Prisma.ChatMessageWhereInput;
import prisma from "~/server/utils/prisma";

export type ChatMessageItem = ChatMessage & {
  relatedDocuments: Array<{ uuid: string; id: number; name: string }>;
};

// Endpoint to get all chat messages for all entities (all objects mode)
export default defineEventHandler(
  async (event): Promise<Array<ChatMessageItem>> => {
    const queryParams: QueryObject = getQuery(event);
    const messagesNewerThanId = queryParams.messagesNewerThanId
      ? +queryParams.messagesNewerThanId
      : null;
    const messagesOlderThanId = queryParams.messagesOlderThanId
      ? +queryParams.messagesOlderThanId
      : null;

    if (
      messagesNewerThanId &&
      messagesOlderThanId &&
      messagesOlderThanId - messagesNewerThanId < 2
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Cannot filter chat messages if newer and older than filter leaves no possible range",
      });
    }

    const whereClause: ChatMessageWhereInput = { relatesToAllEntities: true };

    if (messagesNewerThanId && messagesOlderThanId) {
      whereClause.AND = [
        {
          id: {
            gt: messagesNewerThanId,
          },
        },
        {
          id: {
            lt: messagesOlderThanId,
          },
        },
      ];
    } else if (messagesNewerThanId) {
      whereClause.id = {
        gt: messagesNewerThanId,
      };
    } else if (messagesOlderThanId) {
      whereClause.id = {
        lt: messagesOlderThanId,
      };
    }

    return prisma.chatMessage.findMany({
      where: whereClause,
      include: {
        relatedDocuments: {
          select: {
            uuid: true,
            id: true,
            name: true,
          },
        },
      },
    });
  },
);
