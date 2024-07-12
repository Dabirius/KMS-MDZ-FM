import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";

// Endpoint to delete the chat for a specific entity
export default defineEventHandler(async (event) => {
  // Only allow DELETE requests
  assertMethod(event, ["DELETE"]);
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

  // Delete document
  await prisma.chatMessage.deleteMany({
    where: {
      relatesToAllEntities: false,
      entityId: +entityId,
    },
  });

  // return 204 No Content
  return;
});
