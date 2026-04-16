-- CreateTable
CREATE TABLE "Transacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "empresa" TEXT NOT NULL,
    "dataContaAberta" DATETIME NOT NULL,
    "tipoTransacao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "faturaPaga" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
