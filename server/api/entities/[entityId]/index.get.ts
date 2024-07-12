import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";

// Endpoint to get a specific entity
export default defineEventHandler(async (event) => {
  const entityId = event.context.params?.entityId ?? -1;
  if (!entityId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request is missing required field: entityId",
    });
  }
  return prisma.entity
    .findUniqueOrThrow({
      include: {
        advisor: true,
      },
      where: {
        id: +entityId,
      },
    })
    .catch(() => {
      throw createError({
        statusCode: 404,
        statusMessage: "Entity not found",
      });
    });
});
