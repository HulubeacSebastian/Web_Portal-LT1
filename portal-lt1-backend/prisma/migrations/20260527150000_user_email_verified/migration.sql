-- AlterTable
ALTER TABLE "User" ADD COLUMN "email_verified_at" DATETIME;

-- Conturile existente sunt considerate deja verificate
UPDATE "User" SET "email_verified_at" = CURRENT_TIMESTAMP WHERE "email_verified_at" IS NULL;
