import { Prisma } from "@prisma/client";
import { defineEventHandler } from "h3";
import AdvisorUncheckedCreateInput = Prisma.AdvisorUncheckedCreateInput;
import prisma from "~/server/utils/prisma";

// Endpoint to create a new advisor
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

  // Get information from request body
  const { firstName, lastName, email } = await readBody(event);

  //TODO: fix type error
  const newAdvisor: AdvisorUncheckedCreateInput = {
    firstName,
    lastName,
    email,
    userName: firstName.toLowerCase() + "." + lastName.toLowerCase(),
  };

  // Check if email already exists
  const advisorWithMail = await prisma.advisor.findFirst({
    where: {
      email: email,
    },
  });

  // Check required fields for existing
  if (advisorWithMail && advisorWithMail.id) {
    throw createError({
      statusCode: 400,
      statusMessage: `Advisor with email already exists.`,
    });
  }
  if (!newAdvisor.firstName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Advisor is missing required field: firstName",
    });
  }
  if (!newAdvisor.lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: "Advisor is missing required field: lastName",
    });
  }
  if (!newAdvisor.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Advisor is missing required field: email",
    });
  }

  // Create Advisor
  const createdAdvisor = await prisma.advisor.create({
    data: newAdvisor,
  });

  // return created entity
  return prisma.advisor.findUnique({
    where: {
      id: createdAdvisor.id,
    },
  });
});
