import { Prisma } from "@prisma/client";
import { defineEventHandler } from "h3";
import { QueryObject } from "ufo";
import { CAdvisor, CEntity } from "~/types/db-types";
import prisma from "~/server/utils/prisma";
import EntityWhereInput = Prisma.EntityWhereInput;

export default defineEventHandler(
  async (event): Promise<({ advisor: CAdvisor | null } & CEntity)[]> => {
    const queryParams: QueryObject = getQuery(event);

    const queriedAdvisorId = queryParams.advisorId
      ? +queryParams.advisorId
      : null;
    const queriedExcludeAdvisorId = queryParams.excludeAdvisorId
      ? +queryParams.excludeAdvisorId
      : null;
    const search = queryParams.search
      ? queryParams.search.toString().trim()
      : null;

    if (queriedAdvisorId && queriedExcludeAdvisorId) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Cannot filter request for specific advisorId and excludeAdvisorId simultaneously",
      });
    }

    const whereClause: EntityWhereInput = {};

    if (queriedAdvisorId) {
      // Check if advisor exists
      const advisor = await prisma.advisor.findFirst({
        where: {
          id: queriedAdvisorId,
        },
      });

      // Check required fields for existing
      if (!advisor) {
        throw createError({
          statusCode: 400,
          statusMessage: "Advisor was not found",
        });
      }

      whereClause.advisorId = queriedAdvisorId;
    } else if (queriedExcludeAdvisorId) {
      whereClause.advisorId = {
        not: queriedExcludeAdvisorId,
      };
    }

    // Build search conditions
    if (search && search.length > 0) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    return prisma.entity.findMany({
      orderBy: [
        {
          name: "asc",
        },
      ],
      where: whereClause,
      include: {
        advisor: true,
      },
    });
  },
);
