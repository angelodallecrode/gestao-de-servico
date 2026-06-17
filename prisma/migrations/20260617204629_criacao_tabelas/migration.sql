-- CreateTable
CREATE TABLE "Cliente" (
    "codigo" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Plano" (
    "codigo" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "custoMensal" REAL NOT NULL,
    "data" DATETIME NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Assinatura" (
    "codigo" TEXT NOT NULL PRIMARY KEY,
    "codPlano" TEXT NOT NULL,
    "codCli" TEXT NOT NULL,
    "inicioFidelidade" DATETIME NOT NULL,
    "fimFidelidade" DATETIME NOT NULL,
    "dataUltimoPagamento" DATETIME,
    CONSTRAINT "Assinatura_codPlano_fkey" FOREIGN KEY ("codPlano") REFERENCES "Plano" ("codigo") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assinatura_codCli_fkey" FOREIGN KEY ("codCli") REFERENCES "Cliente" ("codigo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");
