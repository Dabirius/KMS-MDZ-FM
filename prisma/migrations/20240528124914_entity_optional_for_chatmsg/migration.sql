-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "relatesToAllEntities" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "entityId" DROP NOT NULL;
