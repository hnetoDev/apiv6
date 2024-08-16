/*
  Warnings:

  - Made the column `genero` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_tel_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emerg" DROP NOT NULL,
ALTER COLUMN "genero" SET NOT NULL,
ALTER COLUMN "active" SET NOT NULL,
ALTER COLUMN "mensalidade" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL;
