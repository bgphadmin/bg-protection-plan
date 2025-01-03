/*
  Warnings:

  - You are about to drop the column `customerVehicleId` on the `Dealership` table. All the data in the column will be lost.
  - Added the required column `dealershipId` to the `CustomerVehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dealership" DROP CONSTRAINT "Dealership_customerVehicleId_fkey";

-- DropIndex
DROP INDEX "Dealership_customerVehicleId_idx";

-- AlterTable
ALTER TABLE "CustomerVehicle" ADD COLUMN     "dealershipId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Dealership" DROP COLUMN "customerVehicleId";

-- AddForeignKey
ALTER TABLE "CustomerVehicle" ADD CONSTRAINT "CustomerVehicle_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
