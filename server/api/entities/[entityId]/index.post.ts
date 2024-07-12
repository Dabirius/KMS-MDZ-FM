import { defineEventHandler } from "h3";
import { excludePropertiesFromObject } from "~/server/utils/excludePropertiesFromObject";
import prisma from "~/server/utils/prisma";

// Endpoint to update an entity
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

  const contentTypeHeader = getRequestHeader(event, "Content-Type");

  if (!contentTypeHeader || contentTypeHeader.indexOf("application/json") < 0) {
    throw createError({
      statusCode: 415,
      statusMessage:
        "Request does not have expected body content-type (application/json)",
    });
  }

  // Check if entity exists
  const entity = await prisma.entity.findUnique({
    where: {
      id: +entityId,
    },
  });

  // Check required fields for existing
  if (!entity) {
    throw createError({
      statusCode: 400,
      statusMessage: "Entity was not found",
    });
  }

  // Get information from request body
  const reqBody = await readBody(event);

  let name, advisor;
  if (!reqBody) {
    // return 204 No Content - No request body
    return;
  }

  if (reqBody.name) {
    name = reqBody.name;
  }
  if (reqBody.advisor) {
    advisor = reqBody.advisor;
  }

  const entityData: { name?: string; advisor?: any } = {};

  if (name) {
    entityData.name = name;
  }
  if (advisor) {
    // Check if advisor exists
    const queriedAdvisor = await prisma.advisor.findUnique({
      where: {
        id: +advisor,
      },
    });

    // Check required fields for existing
    if (!queriedAdvisor || !advisor) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Entity is missing required field: advisor, or advisor was not found",
      });
    } else {
      entityData.advisor = {
        connect: { id: +queriedAdvisor.id },
      };
    }
  }

  if (Object.keys(entityData).length > 0) {
    // object has keys
    // Update entity
    const x = await prisma.entity.update({
      where: {
        id: +entityId,
      },
      data: {
        ...entityData,
      },
    });

    return x;
  }

  // return 204 No Content
  return;
});
