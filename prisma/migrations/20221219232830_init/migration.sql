-- CreateTable
CREATE TABLE "Instances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "api_key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "InstanceData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instance_id" TEXT NOT NULL,
    "cache" TEXT NOT NULL,
    CONSTRAINT "InstanceData_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "Instances" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Instances_uri_key" ON "Instances"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "InstanceData_instance_id_key" ON "InstanceData"("instance_id");
