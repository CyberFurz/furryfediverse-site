-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Instances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nsfwflag" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Instances" ("api_key", "id", "name", "nsfwflag", "type", "uri", "verified") SELECT "api_key", "id", "name", "nsfwflag", "type", "uri", "verified" FROM "Instances";
DROP TABLE "Instances";
ALTER TABLE "new_Instances" RENAME TO "Instances";
CREATE UNIQUE INDEX "Instances_uri_key" ON "Instances"("uri");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
