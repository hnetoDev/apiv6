/*
  Warnings:

  - The `exercicios` column on the `Treino` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Treino" DROP COLUMN "exercicios",
ADD COLUMN     "exercicios" JSONB;
