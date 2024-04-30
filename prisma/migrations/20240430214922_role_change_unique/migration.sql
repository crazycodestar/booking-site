/*
  Warnings:

  - A unique constraint covering the columns `[id,role]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_role_key";

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_role_key" ON "Role"("id", "role");
