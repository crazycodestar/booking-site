-- CreateTable
CREATE TABLE "Library" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "openingHours" DATETIME NOT NULL,
    "closingHours" DATETIME NOT NULL,
    "noOfSeatsPerRoom" INTEGER NOT NULL DEFAULT 10
);
