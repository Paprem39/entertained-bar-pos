/*
  Warnings:

  - A unique constraint covering the columns `[billId,productId,mixerSignature]` on the table `BillItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BillItem" ADD COLUMN     "mixerSignature" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "BillItem_billId_productId_mixerSignature_key" ON "BillItem"("billId", "productId", "mixerSignature");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
