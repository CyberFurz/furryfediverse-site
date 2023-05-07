-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Instances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nsfwflag" TEXT NOT NULL,
    "api_mode" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "ban_reason" TEXT NOT NULL DEFAULT '',
    "failed_checks" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Instances" ("api_mode", "ban_reason", "banned", "id", "name", "nsfwflag", "type", "uri", "verified") SELECT "api_mode", "ban_reason", "banned", "id", "name", "nsfwflag", "type", "uri", "verified" FROM "Instances";
DROP TABLE "Instances";
ALTER TABLE "new_Instances" RENAME TO "Instances";
CREATE UNIQUE INDEX "Instances_uri_key" ON "Instances"("uri");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
