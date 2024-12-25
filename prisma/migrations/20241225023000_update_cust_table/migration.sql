/*
  Warnings:

  - You are about to drop the column `customerId` on the `Dealership` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dealership" DROP CONSTRAINT "Dealership_customerId_fkey";

-- DropIndex
DROP INDEX "CustomerVehicle_customerId_idx";

-- DropIndex
DROP INDEX "Dealership_customerId_idx";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "dealershipId" TEXT;

-- AlterTable
ALTER TABLE "Dealership" DROP COLUMN "customerId";

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
