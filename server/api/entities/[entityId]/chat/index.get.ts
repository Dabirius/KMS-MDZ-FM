import { ChatMessage, Prisma } from "@prisma/client";
import { defineEventHandler } from "h3";
import { QueryObject } from "ufo";
import ChatMessageWhereInput = Prisma.ChatMessageWhereInput;
import prisma from "~/server/utils/prisma";

export type ChatMessageItem = ChatMessage & {
  relatedDocuments: Array<{ uuid: string; id: number; name: string }>;
};

// Endpoint to get all chat messages for a specific entity
export default defineEventHandler(
  async (event): Promise<Array<ChatMessageItem>> => {
    const entityId = event.context.params?.entityId ?? -1;
    if (!entityId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Request is missing required field: entityId",
      });
    }

    // get entity
    const foundEntity = await prisma.entity.findUnique({
      where: {
        id: +entityId,
      },
    });

    if (!foundEntity) {
      throw createError({
        statusCode: 400,
        statusMessage: "Entity not found",
      });
    }

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

    const whereClause: ChatMessageWhereInput = { entityId: +entityId };

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
