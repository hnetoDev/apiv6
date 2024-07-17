/*
  Warnings:

  - Added the required column `img` to the `Exercicio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercicio" ADD COLUMN     "img" TEXT NOT NULL;
