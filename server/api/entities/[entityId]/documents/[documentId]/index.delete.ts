import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";

// Endpoint to delete a specific document
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
  const documentId = event.context.params?.documentId ?? -1;
  if (!documentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request is missing required field: documentId",
    });
  }

  // get document
  const document = await prisma.document.findUnique({
    where: {
      id: +documentId,
    },
  });

  if (!document) {
    throw createError({
      statusCode: 400,
      statusMessage: "Document not found",
    });
  }

  // Delete document
  await prisma.document.delete({
    where: {
      id: +documentId,
    },
  });

  // return 204 No Content
  return;
});
