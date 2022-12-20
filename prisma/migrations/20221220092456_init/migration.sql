/*
  Warnings:

  - Added the required column `nsfwflag` to the `Instances` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Instances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nsfwflag" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "api_key" TEXT NOT NULL
);
INSERT INTO "new_Instances" ("api_key", "id", "name", "type", "uri") SELECT "api_key", "id", "name", "type", "uri" FROM "Instances";
DROP TABLE "Instances";
ALTER TABLE "new_Instances" RENAME TO "Instances";
CREATE UNIQUE INDEX "Instances_uri_key" ON "Instances"("uri");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
