import { Prisma } from "@prisma/client";
import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";
import EntityUncheckedCreateInput = Prisma.EntityUncheckedCreateInput;

// Endpoint that updates the progress of a lesson
export default defineEventHandler(async (event) => {
  // Only allow POST requests
  assertMethod(event, ["POST"]);

  const contentTypeHeader = getRequestHeader(event, "Content-Type");

  if (!contentTypeHeader || contentTypeHeader.indexOf("application/json") < 0) {
    throw createError({
      statusCode: 415,
      statusMessage:
        "Request does not have expected body content-type (application/json)",
    });
  }

  const newEntity: EntityUncheckedCreateInput = { name: "" };

  // Get information from request body
  const { name, advisor } = await readBody(event);

  newEntity.name = name.toString();
  newEntity.advisorId = parseInt(advisor.toString() ?? "0");

  let targetedAdvisor: { id?: number } = {};
  // Check if advisor exists
  if (advisor && +newEntity.advisorId) {
    targetedAdvisor = await prisma.advisor.findFirst({
      where: {
        id: +newEntity.advisorId,
      },
    });
  }

  // Check required fields for existing
  if (!targetedAdvisor || !newEntity.advisorId) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Entity is missing required field: advisor, or advisor was not found",
    });
  }
  if (!newEntity.name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Entity is missing required field: name",
    });
  }

  // Create Entity
  const createdEntity = await prisma.entity.create({
    data: {
      name: newEntity.name,
      advisor: {
        connect: { id: +newEntity.advisorId },
      },
    },
  });

  // return created entity
  return prisma.entity.findUnique({
    where: {
      id: createdEntity.id,
    },
    include: {
      advisor: {
        select: {
          id: true,
        },
      },
    },
  });
});
