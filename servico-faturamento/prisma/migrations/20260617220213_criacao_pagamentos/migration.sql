-- CreateTable
CREATE TABLE "Pagamento" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codAss" INTEGER NOT NULL,
    "valorPago" REAL NOT NULL,
    "dataPagamento" DATETIME NOT NULL
);
