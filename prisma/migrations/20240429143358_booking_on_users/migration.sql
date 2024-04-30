/*
  Warnings:

  - You are about to drop the column `code` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Booking` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "BookingsOnUsers" (
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    PRIMARY KEY ("userId", "bookingId"),
    CONSTRAINT "BookingsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingsOnUsers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entryTime" DATETIME NOT NULL,
    "exitTime" DATETIME NOT NULL,
    "seatId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "BookingStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "entryTime", "exitTime", "id", "seatId", "statusId") SELECT "createdAt", "entryTime", "exitTime", "id", "seatId", "statusId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
