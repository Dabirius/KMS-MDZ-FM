import { Prisma } from "@prisma/client";
import { defineEventHandler } from "h3";
import { QueryObject } from "ufo";
import AdvisorWhereInput = Prisma.AdvisorWhereInput;
import AdvisorInclude = Prisma.AdvisorInclude;
import prisma from "~/server/utils/prisma";

// Endpoint to get all advisors
export default defineEventHandler(async (event) => {
  const queryParams: QueryObject = getQuery(event);

  const search = queryParams.search
    ? queryParams.search.toString().trim()
    : null;
  const includeEntities = !!(
    queryParams.includeEntities && queryParams.includeEntities === "true"
  );

  const whereClause: AdvisorWhereInput = {};
  const include: AdvisorInclude = {};

  if (includeEntities) {
    include.entities = {
      select: {
        id: true,
        name: true,
      },
    };
  }

  // Build search conditions
  if (search && search.length > 0) {
    whereClause.OR = [
      {
        firstName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        userName: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];

    const searchContainsSpace = search.indexOf(" ") > -1;
    if (searchContainsSpace) {
      whereClause.OR.push({
        AND: [
          {
            firstName: {
              contains: search.split(" ")[0],
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search.split(" ")[1],
              mode: "insensitive",
            },
          },
        ],
      });
    }
  }

  return prisma.advisor.findMany({
    where: whereClause,
    include: include,
    orderBy: [
      {
        id: "asc",
      },
    ],
  });
});
