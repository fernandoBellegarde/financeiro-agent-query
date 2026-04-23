/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Transacao` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataContaAberta" DATETIME NOT NULL,
    "tipoTransacao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "faturaPaga" BOOLEAN NOT NULL,
    "client_origin_id" TEXT NOT NULL,
    "authorizedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transacao_client_origin_id_fkey" FOREIGN KEY ("client_origin_id") REFERENCES "Cliente" ("client_origin_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transacao" ("client_origin_id", "dataContaAberta", "faturaPaga", "id", "tipoTransacao", "valor") SELECT "client_origin_id", "dataContaAberta", "faturaPaga", "id", "tipoTransacao", "valor" FROM "Transacao";
DROP TABLE "Transacao";
ALTER TABLE "new_Transacao" RENAME TO "Transacao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
