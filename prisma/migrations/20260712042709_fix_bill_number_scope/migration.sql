/*
  Warnings:

  - A unique constraint covering the columns `[businessSessionId,billNumber]` on the table `Bill` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Bill_billNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Bill_businessSessionId_billNumber_key" ON "Bill"("businessSessionId", "billNumber");
