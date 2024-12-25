/*
  Warnings:

  - You are about to drop the column `address1` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `caontactPerson` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `enteredBy` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address1",
DROP COLUMN "address2",
DROP COLUMN "caontactPerson",
DROP COLUMN "enteredBy";

-- AlterTable
ALTER TABLE "Dealership" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
