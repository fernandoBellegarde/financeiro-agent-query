/*
  Warnings:

  - You are about to drop the column `dataContaAberta` on the `Transacao` table. All the data in the column will be lost.
  - You are about to drop the column `faturaPaga` on the `Transacao` table. All the data in the column will be lost.
  - Added the required column `dataContaAberta` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "client_origin_id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "dataContaAberta" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cliente" ("client_origin_id", "createdAt", "email", "nome") SELECT "client_origin_id", "createdAt", "email", "nome" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE TABLE "new_Transacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoTransacao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "client_origin_id" TEXT NOT NULL,
    "authorizedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transacao_client_origin_id_fkey" FOREIGN KEY ("client_origin_id") REFERENCES "Cliente" ("client_origin_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transacao" ("authorizedAt", "client_origin_id", "id", "tipoTransacao", "valor") SELECT "authorizedAt", "client_origin_id", "id", "tipoTransacao", "valor" FROM "Transacao";
DROP TABLE "Transacao";
ALTER TABLE "new_Transacao" RENAME TO "Transacao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
