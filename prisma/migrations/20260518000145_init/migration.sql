-- CreateTable
CREATE TABLE "Endpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 300,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Check" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" INTEGER NOT NULL,
    "latency" INTEGER NOT NULL,
    "isUp" BOOLEAN NOT NULL,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endpointId" TEXT NOT NULL,
    CONSTRAINT "Check_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "Endpoint" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
