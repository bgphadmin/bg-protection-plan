-- DropForeignKey
ALTER TABLE "CustomerVehicle" DROP CONSTRAINT "CustomerVehicle_dealershipId_fkey";

-- AlterTable
ALTER TABLE "CustomerVehicle" ALTER COLUMN "dealershipId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomerVehicle" ADD CONSTRAINT "CustomerVehicle_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
