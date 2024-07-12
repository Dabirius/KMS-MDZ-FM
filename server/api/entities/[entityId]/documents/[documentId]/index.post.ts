import { defineEventHandler } from "h3";
import { excludePropertiesFromObject } from "~/server/utils/excludePropertiesFromObject";
import prisma from "~/server/utils/prisma";

// Endpoint to update a specific document
export default defineEventHandler(async (event) => {
  // Only allow POST requests
  assertMethod(event, ["POST"]);

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

  const contentTypeHeader = getRequestHeader(event, "Content-Type");

  if (!contentTypeHeader || contentTypeHeader.indexOf("application/json") < 0) {
    throw createError({
      statusCode: 415,
      statusMessage:
        "Request does not have expected body content-type (application/json)",
    });
  }

  // Get information from request body
  const { name } = await readBody(event);

  // Check if entity exists
  const entity = await prisma.entity.findUnique({
    where: {
      id: +entityId,
    },
  });

  // Check if document exists
  const document = await prisma.document.findUnique({
    where: {
      id: +documentId,
    },
  });

  // Check required fields for existing
  if (!entity) {
    throw createError({
      statusCode: 400,
      statusMessage: "Entity was not found",
    });
  }
  if (!document) {
    throw createError({
      statusCode: 400,
      statusMessage: "Document was not found",
    });
  }

  if (name) {
    // Update document
    const updatedDocument = await prisma.document.update({
      where: {
        id: +documentId,
      },
      data: {
        name: name + ".pdf",
      },
    });
    return excludePropertiesFromObject(updatedDocument, [
      "data",
      "textContent",
    ]);
  }

  return excludePropertiesFromObject(document, ["data", "textContent"]);
});
