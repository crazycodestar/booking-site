/*
  Warnings:

  - You are about to drop the column `statusId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `statusId` to the `BookingsOnUsers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entryTime" DATETIME NOT NULL,
    "exitTime" DATETIME NOT NULL,
    "seatId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "entryTime", "exitTime", "id", "seatId") SELECT "createdAt", "entryTime", "exitTime", "id", "seatId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_BookingsOnUsers" (
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    PRIMARY KEY ("userId", "bookingId"),
    CONSTRAINT "BookingsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingsOnUsers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingsOnUsers_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "BookingStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingsOnUsers" ("bookingId", "code", "userId") SELECT "bookingId", "code", "userId" FROM "BookingsOnUsers";
DROP TABLE "BookingsOnUsers";
ALTER TABLE "new_BookingsOnUsers" RENAME TO "BookingsOnUsers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
