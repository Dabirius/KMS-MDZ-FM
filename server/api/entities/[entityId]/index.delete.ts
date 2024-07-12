import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";

// Endpoint to delete a specific entity
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

  // get created entity
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

  // Delete of entity will delete related chats and documents,
  // as well as remove the entry from advisor through cascading actions.
  await prisma.entity.delete({
    where: {
      id: +foundEntity.id,
    },
  });

  // return 204 No Content
  return;
});
