-- CreateEnum
CREATE TYPE "Method" AS ENUM ('pix', 'dinheiro', 'aplicativo');

-- CreateEnum
CREATE TYPE "TypeOfExercicio" AS ENUM ('BICEPS', 'PEITO', 'COSTAS', 'TRICEPS', 'OMBRO', 'ANTEBRACO', 'ABDOMEN', 'GLUTEO', 'POSTERIOR', 'QUADRICEPS', 'PANTURRILHA', 'TRAPEZIO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "emerg" TEXT NOT NULL,
    "genero" TEXT,
    "active" BOOLEAN,
    "mensalidade" TEXT NOT NULL,
    "planoId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "qtd" INTEGER DEFAULT 0,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrada" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "method" "Method" NOT NULL,
    "date" TEXT,
    "value" TEXT,
    "month" INTEGER,
    "userId" TEXT NOT NULL,
    "planoId" TEXT,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercicio" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TypeOfExercicio" NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treino" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "treinador" TEXT NOT NULL,
    "exercicios" TEXT[],

    CONSTRAINT "Treino_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tel_key" ON "User"("tel");

-- CreateIndex
CREATE UNIQUE INDEX "Exercicio_name_key" ON "Exercicio"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Treino_name_key" ON "Treino"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE SET NULL ON UPDATE CASCADE;
