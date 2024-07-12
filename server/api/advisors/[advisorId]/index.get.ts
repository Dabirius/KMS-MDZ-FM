import { defineEventHandler } from "h3";
import prisma from "~/server/utils/prisma";

// Endpoint to get a specific advisor
export default defineEventHandler(async (event) => {
  const advisorId = event.context.params?.advisorId ?? -1;
  if (!advisorId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Request is missing required field: advisorId",
    });
  }
  return prisma.advisor
    .findUniqueOrThrow({
      where: {
        id: +advisorId,
      },
      include: {
        entities: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    .catch(() => {
      throw createError({
        statusCode: 404,
        statusMessage: "Advisor not found",
      });
    });
});
