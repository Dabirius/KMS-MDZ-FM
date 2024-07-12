import { $Enums, Prisma } from "@prisma/client";
import { defineEventHandler } from "h3";
import ChatMessageCreateInput = Prisma.ChatMessageCreateInput;
import Sendertype = $Enums.Sendertype;
import prisma from "~/server/utils/prisma";
import { ChatMessageItem } from "./index.get";
import { CDocument } from "~/types/db-types";

// Endpoint to create a new chat message for a specific entity
export default defineEventHandler(async (event): Promise<ChatMessageItem> => {
  // Only allow POST requests
  assertMethod(event, ["POST"]);

  const entityId = event.context.params?.entityId ?? -1;
  if (!entityId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request is missing required field: entityId",
    });
  }

  const contentTypeHeader = getRequestHeader(event, "Content-Type");

  if (!contentTypeHeader || contentTypeHeader.indexOf("application/json") < 0) {
    throw createError({
      statusCode: 415,
      statusMessage:
        "Request does not have expected body content-type (application/json)",
    });
  }

  const newChatMessage: ChatMessageCreateInput = {
    message: "",
    entity: {
      connect: { id: +entityId },
    },
    sender: Sendertype.ADVISOR,
  };

  // Get information from request body
  const { message, relatedDocuments, sender } = await readBody(event);

  // Check if entity exists
  const entity = await prisma.entity.findUnique({
    where: {
      id: +entityId,
    },
  });

  if (message) {
    newChatMessage.message = message;
  }
  if (sender === Sendertype.SYSTEM) {
    newChatMessage.sender = Sendertype.SYSTEM;
  }
  let hasDocuments: boolean = false;
  if (relatedDocuments) {
    newChatMessage.relatedDocuments = {
      connect: [],
    };
    const documentsArr: Array<{ id: number }> = [];
    relatedDocuments.forEach((i: string | number) => {
      if (i && +i) {
        hasDocuments = true;
        documentsArr.push({ id: +i });
      }
    });

    newChatMessage.relatedDocuments.connect = documentsArr;
  }

  // Check required fields for existing
  if (!entity) {
    throw createError({
      statusCode: 400,
      statusMessage: "Entity not found",
    });
  }
  if (!newChatMessage.message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Chat message is missing required field: message",
    });
  }
  if (!relatedDocuments || relatedDocuments.length < 0 || !hasDocuments) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Chat message is missing required field: related documents",
    });
  }

  const newMessage = await prisma.chatMessage.create({
    data: newChatMessage,
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

  // ignore await because we actually want to post this asynchronously
  postMessageToMiddleware(
    {
      Dokumenten_IDs: newMessage.relatedDocuments.map((d: CDocument) => d.uuid),
      Nutzeranfrage: newChatMessage.message,
      Neuer_Chat: true,
    },
    newMessage,
  );

  return newMessage;
});

async function postMessageToMiddleware(
  chatInformation: {
    Dokumenten_IDs: Array<string>;
    Nutzeranfrage: string;
    Neuer_Chat: boolean;
  },
  triggerChatMessage: ChatMessageItem,
) {
  if (
    !(
      chatInformation &&
      chatInformation.Dokumenten_IDs &&
      chatInformation.Nutzeranfrage &&
      chatInformation.Neuer_Chat
    )
  ) {
    // no chat information
    return;
  }

  try {
    const MIDDLEWARE_API_BASEPATH = process.env.MIDDLEWARE_API_BASEPATH;
    const response = await fetch(MIDDLEWARE_API_BASEPATH + "/user_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatInformation),
    });
    if (response.ok) {
      const responseObj =
        response.headers.get("Content-Type") &&
        response.headers.get("Content-Type")!.indexOf("application/json") >= 0
          ? await response.json()
          : await response.text();
      if (
        typeof responseObj === "string" &&
        responseObj.startsWith("Da hat etwas nicht geklappt.")
      ) {
        // error
        return;
      } else if (typeof responseObj === "string") {
        const newMessage: ChatMessageCreateInput = {
          message: "",
          entity: {
            connect: { id: +triggerChatMessage.entityId },
          },
          sender: Sendertype.SYSTEM,
        };

        if (responseObj) {
          newMessage.message = responseObj;
        }
        newMessage.relatedDocuments = {
          connect: triggerChatMessage.relatedDocuments,
        };

        await prisma.chatMessage.create({
          data: newMessage,
        });
      }
    }
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: `Error while posting chat to middleware. Details: ${e}`,
    });
  }
}
