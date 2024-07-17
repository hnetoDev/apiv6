-- AlterTable
ALTER TABLE "User" ADD COLUMN     "treinoId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_treinoId_fkey" FOREIGN KEY ("treinoId") REFERENCES "Treino"("id") ON DELETE SET NULL ON UPDATE CASCADE;
