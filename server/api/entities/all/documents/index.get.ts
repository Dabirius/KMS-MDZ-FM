import { $Enums, Document as PrismaDocument } from "@prisma/client";
import { defineEventHandler } from "h3";
import Documenttype = $Enums.Documenttype;
import { excludePropertiesFromObject } from "~/server/utils/excludePropertiesFromObject";
import prisma from "~/server/utils/prisma";

// Endpoint to get all documents of all entities
export default defineEventHandler(
  async (event): Promise<Omit<PrismaDocument, "data" | "textContent">> => {
    // Only allow GET requests
    assertMethod(event, ["GET"]);

    const documents = await prisma.document.findMany({
      where: {
        type: Documenttype.DOCUMENT,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return documents.map((d: PrismaDocument) =>
      excludePropertiesFromObject(d, ["data", "textContent"]),
    );
  },
);
