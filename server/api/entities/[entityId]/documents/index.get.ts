import { $Enums, Document as PrismaDocument } from "@prisma/client";
import { defineEventHandler } from "h3";
import Documenttype = $Enums.Documenttype;
import { excludePropertiesFromObject } from "~/server/utils/excludePropertiesFromObject";
import prisma from "~/server/utils/prisma";

// Endpoint to get all documents of an entity
export default defineEventHandler(
  async (event): Promise<Omit<PrismaDocument, "data" | "textContent">> => {
    // Only allow GET requests
    assertMethod(event, ["GET"]);
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

    const documents = await prisma.document.findMany({
      where: {
        entityId: +entityId,
        type: Documenttype.DOCUMENT,
      },
      orderBy: [
        {
          id: "asc",
        },
      ],
    });

    return documents.map((d: PrismaDocument) =>
      excludePropertiesFromObject(d, ["data", "textContent"]),
    );
  },
);
