import { defineEventHandler } from "h3";
import { excludePropertiesFromObject } from "~/server/utils/excludePropertiesFromObject";
import prisma from "~/server/utils/prisma";

// Endpoint to get a specific document
export default defineEventHandler(async (event) => {
  // Only allow GET requests
  assertMethod(event, ["GET"]);
  const entityId = event.context.params?.entityId ?? -1;
  if (!entityId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request is missing required field: entityId",
    });
  }
  const documentId = event.context.params?.documentId ?? -1;
  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request is missing required field: documentId",
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

  // get document
  const foundDocument = await prisma.document.findUnique({
    where: {
      id: +documentId,
    },
  });

  if (!foundDocument) {
    throw createError({
      statusCode: 400,
      statusMessage: "Document not found",
    });
  }

  return excludePropertiesFromObject(foundDocument, ["data", "textContent"]);
});
