/*
  Warnings:

  - You are about to drop the column `cache` on the `InstanceData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstanceData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instance_id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "thumbnail" TEXT NOT NULL DEFAULT '',
    "registrations" BOOLEAN NOT NULL DEFAULT false,
    "approval_required" BOOLEAN NOT NULL DEFAULT false,
    "user_count" INTEGER NOT NULL DEFAULT 0,
    "status_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "InstanceData_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "Instances" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InstanceData" ("description", "id", "instance_id", "status_count", "thumbnail", "title", "user_count") SELECT "description", "id", "instance_id", "status_count", "thumbnail", "title", "user_count" FROM "InstanceData";
DROP TABLE "InstanceData";
ALTER TABLE "new_InstanceData" RENAME TO "InstanceData";
CREATE UNIQUE INDEX "InstanceData_instance_id_key" ON "InstanceData"("instance_id");
CREATE TABLE "new_Instances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nsfwflag" TEXT NOT NULL,
    "api_mode" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "ban_reason" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Instances" ("api_mode", "id", "name", "nsfwflag", "type", "uri", "verified") SELECT "api_mode", "id", "name", "nsfwflag", "type", "uri", "verified" FROM "Instances";
DROP TABLE "Instances";
ALTER TABLE "new_Instances" RENAME TO "Instances";
CREATE UNIQUE INDEX "Instances_uri_key" ON "Instances"("uri");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
