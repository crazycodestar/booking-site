/*
  Warnings:

  - A unique constraint covering the columns `[status]` on the table `BookingStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookingStatus_status_key" ON "BookingStatus"("status");
