/*
  Warnings:

  - You are about to drop the column `completedStitches` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `totalStitches` on the `Section` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Section" DROP COLUMN "completedStitches",
DROP COLUMN "totalStitches";
