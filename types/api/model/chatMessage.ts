/**
 * MDZ Project Assistant Middleware API
 * This is the api description of the middleware for the MDZ Project Assistant.
 *
 * The version of the OpenAPI document: 1.0.11
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface ChatMessage {
  readonly id?: number;
  sender?: ChatMessage.SenderEnum;
  message?: string;
  timestamp?: string;
  relatedDocuments?: Array<number>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ChatMessage {
  export type SenderEnum = "advisor" | "system";
  export const SenderEnum = {
    Advisor: "advisor" as SenderEnum,
    System: "system" as SenderEnum,
  };
}