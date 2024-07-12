import { $Enums, Prisma } from "@prisma/client";
import { defineEventHandler, MultiPartData } from "h3";
import Documenttype = $Enums.Documenttype;
import DocumentCreateInput = Prisma.DocumentCreateInput;
import { excludePropertiesFromObject } from "~/server/utils/excludePropertiesFromObject";
import { readPdfText } from "pdf-text-reader";
import prisma from "~/server/utils/prisma";

// Endpoint to create a document
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

  if (
    !contentTypeHeader ||
    contentTypeHeader.indexOf("multipart/form-data") < 0
  ) {
    throw createError({
      statusCode: 415,
      statusMessage:
        "Request does not have expected body content-type (multipart/form-data)",
    });
  }

  const newDocument: DocumentCreateInput = {
    name: "",
    textContent: "",
    data: Buffer.from(Number(1).toString(16), "hex"),
    type: Documenttype.DOCUMENT,
  };
  let documentFile: MultiPartData | undefined = undefined;

  // Get information from request body
  const requestBody = await readMultipartFormData(event);

  // parse request body
  requestBody?.forEach((value) => {
    switch (value.name) {
      case "name": {
        newDocument.name = value.data.toString() + ".pdf";
        break;
      }
      case "file": {
        documentFile = value;
        newDocument.data = new Uint8Array(value.data) as Buffer;
        break;
      }
      case "type": {
        if (
          value.data.toString() === Documenttype.DATA_SHEET ||
          value.data.toString() === Documenttype.DOCUMENT
        ) {
          newDocument.type = value.data.toString() as Documenttype;
        }
        break;
      }
    }
  });

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
      statusMessage: "Entity not found",
    });
  }
  if (!newDocument.name) {
    if (
      documentFile &&
      (documentFile as MultiPartData).filename &&
      (documentFile as MultiPartData).filename?.toString()
    ) {
      newDocument.name = (documentFile as MultiPartData).filename!.toString();
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: "Document is missing required field: name",
      });
    }
  }
  if (!newDocument.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Document is missing required field: file",
    });
  }

  // If document, normal creation

  newDocument.entity = {
    connect: { id: +entityId },
  };

  let documentContent = "";

  try {
    documentContent = await readPdfText({ data: newDocument.data });
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: `Error while reading content from document. Details: ${e}`,
    });
  }

  newDocument.textContent = documentContent;

  // Create Document
  const createdDocument = await prisma.document.create({
    data: newDocument,
  });

  let updatedDocument = null;

  // ---- Post Document to Middleware
  if (process.env.MIDDLEWARE_API_BASEPATH) {
    const MIDDLEWARE_API_BASEPATH = process.env.MIDDLEWARE_API_BASEPATH;
    const documentInformation = [];
    documentInformation.push({
      Dokumenten_ID: createdDocument.uuid,
      Dokumententitel: createdDocument.name,
      Text: [createdDocument.textContent],
    });
    try {
      const response = await fetch(MIDDLEWARE_API_BASEPATH + "/text_to_db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentInformation),
      });
      if (response.ok) {
        const responseObj =
          response.headers.get("Content-Type") &&
          response.headers.get("Content-Type")!.indexOf("application/json") >= 0
            ? await response.json()
            : await response.text();
        // Transmitted to API?
        if (responseObj.msg) {
          // Assume Success
          updatedDocument = await prisma.document.update({
            data: {
              knownToMiddleware: true,
            },
            where: {
              id: createdDocument.id,
            },
          });
        }
      }
    } catch (e) {
      throw createError({
        statusCode: 400,
        statusMessage: `Error while posting document to middleware. Details: ${e}`,
      });
    }
  }

  return excludePropertiesFromObject(
    updatedDocument && updatedDocument.id ? updatedDocument : createdDocument,
    ["data"],
  );
});
