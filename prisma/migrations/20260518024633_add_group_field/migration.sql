-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Endpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "headers" TEXT,
    "body" TEXT,
    "group" TEXT NOT NULL DEFAULT 'Default',
    "interval" INTEGER NOT NULL DEFAULT 300,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Endpoint" ("body", "createdAt", "headers", "id", "interval", "method", "name", "url") SELECT "body", "createdAt", "headers", "id", "interval", "method", "name", "url" FROM "Endpoint";
DROP TABLE "Endpoint";
ALTER TABLE "new_Endpoint" RENAME TO "Endpoint";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
