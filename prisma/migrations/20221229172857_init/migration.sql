-- CreateTable
CREATE TABLE "Reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporter" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "reason" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tokens" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "user" TEXT NOT NULL,
    "valid_to" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Reports_uri_key" ON "Reports"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_user_key" ON "Tokens"("user");
