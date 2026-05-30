-- AlterTable Project: remove notes
ALTER TABLE "Project" DROP COLUMN IF EXISTS "notes";

-- AlterTable Section: add notes
ALTER TABLE "Section" ADD COLUMN "notes" TEXT NOT NULL DEFAULT '';
