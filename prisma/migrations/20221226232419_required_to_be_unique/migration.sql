/*
  Warnings:

  - You are about to drop the column `api_key` on the `Instances` table. All the data in the column will be lost.
  - Added the required column `description` to the `InstanceData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_count` to the `InstanceData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `InstanceData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `InstanceData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_count` to the `InstanceData` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ApiKeys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instance_id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ApiKeys_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "Instances" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstanceData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instance_id" TEXT NOT NULL,
    "cache" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "user_count" INTEGER NOT NULL,
    "status_count" INTEGER NOT NULL,
    CONSTRAINT "InstanceData_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "Instances" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InstanceData" ("cache", "id", "instance_id") SELECT "cache", "id", "instance_id" FROM "InstanceData";
DROP TABLE "InstanceData";
ALTER TABLE "new_InstanceData" RENAME TO "InstanceData";
CREATE UNIQUE INDEX "InstanceData_instance_id_key" ON "InstanceData"("instance_id");
CREATE TABLE "new_Instances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nsfwflag" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Instances" ("id", "name", "nsfwflag", "type", "uri", "verified") SELECT "id", "name", "nsfwflag", "type", "uri", "verified" FROM "Instances";
DROP TABLE "Instances";
ALTER TABLE "new_Instances" RENAME TO "Instances";
CREATE UNIQUE INDEX "Instances_uri_key" ON "Instances"("uri");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_instance_id_key" ON "ApiKeys"("instance_id");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_api_key_key" ON "ApiKeys"("api_key");
