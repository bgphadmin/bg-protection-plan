/*
  Warnings:

  - The `dealershipId` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Dealership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Dealership` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dealershipId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `dealershipId` on the `ProtectionPlanAvailed` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_dealershipId_fkey";

-- DropForeignKey
ALTER TABLE "ProtectionPlanAvailed" DROP CONSTRAINT "ProtectionPlanAvailed_dealershipId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_dealershipId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "dealershipId",
ADD COLUMN     "dealershipId" INTEGER;

-- AlterTable
ALTER TABLE "Dealership" DROP CONSTRAINT "Dealership_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Dealership_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProtectionPlanAvailed" DROP COLUMN "dealershipId",
ADD COLUMN     "dealershipId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dealershipId",
ADD COLUMN     "dealershipId" INTEGER;

-- CreateIndex
CREATE INDEX "ProtectionPlanAvailed_dealershipId_idx" ON "ProtectionPlanAvailed"("dealershipId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectionPlanAvailed" ADD CONSTRAINT "ProtectionPlanAvailed_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
