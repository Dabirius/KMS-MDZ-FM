export type CAdvisor = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
};

export type CEntity = {
  id: number;
  name: string;
  advisorId: number | null;
};

export const enum CDocumenttype {
  DATA_SHEET = "DATA_SHEET",
  DOCUMENT = "DOCUMENT",
}

export const enum CSendertype {
  ADVISOR = "ADVISOR",
  SYSTEM = "SYSTEM",
}

export type CDocument = {
  id: number;
  uuid: string;
  createdAt: Date;
  type: typeof CDocumenttype;
  knownToMiddleware: boolean;
  name: string;
  data: Buffer;
  textContent: string;
  entityId: number | null;
};

export type CChatMessage = {
  message: string;
  sender: CSendertype;
  id: number;
  uuid: string;
  timestamp: string | Date;
  entityId: number;
  relatedDocuments?: Array<Pick<CDocument, "uuid" | "id" | "name">>;
};
