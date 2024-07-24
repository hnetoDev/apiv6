-- DropForeignKey
ALTER TABLE "Entrada" DROP CONSTRAINT "Entrada_userId_fkey";

-- AlterTable
ALTER TABLE "Entrada" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
