-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "dealershipId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "fName" TEXT NOT NULL,
    "lName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "landline" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "caontactPerson" TEXT,
    "userId" TEXT NOT NULL,
    "enteredBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerVehicle" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT,
    "year" INTEGER,
    "vin" TEXT,
    "plateNo" TEXT NOT NULL,
    "registration" TEXT,
    "transmission" TEXT,
    "fuelEngineType" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "enteredBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "mobile" TEXT NOT NULL,
    "landline" TEXT,
    "contactPerson" TEXT,
    "customerVehicleId" TEXT,
    "customerId" TEXT,
    "enteredBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtectionPlanAvailed" (
    "id" TEXT NOT NULL,
    "invoice" TEXT NOT NULL,
    "receipt" TEXT NOT NULL,
    "odometerReading" INTEGER NOT NULL,
    "initialServiceDate" TEXT NOT NULL,
    "servicePerformedBy" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "expired" BOOLEAN NOT NULL,
    "renewal" BOOLEAN NOT NULL,
    "engineOilUsed" TEXT,
    "customerId" TEXT NOT NULL,
    "customerVehicleId" TEXT NOT NULL,
    "dealershipId" TEXT NOT NULL,
    "eneteredBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "protectionPlanId" TEXT NOT NULL,

    CONSTRAINT "ProtectionPlanAvailed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtectionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "protectionPlanCategory" TEXT NOT NULL,
    "serviceDescription" TEXT NOT NULL,
    "reimbursementAmount" DOUBLE PRECISION NOT NULL,
    "planTermId" TEXT NOT NULL,
    "coverage" TEXT NOT NULL,
    "serviceInterval" TEXT NOT NULL,
    "fuelEngineType" TEXT NOT NULL,

    CONSTRAINT "ProtectionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanTerms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PlanTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtectionPlanCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProtectionPlanCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelEngineType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FuelEngineType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineOil" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EngineOil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_mobile_key" ON "Customer"("mobile");

-- CreateIndex
CREATE INDEX "Customer_userId_idx" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerVehicle_vin_key" ON "CustomerVehicle"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerVehicle_plateNo_key" ON "CustomerVehicle"("plateNo");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerVehicle_registration_key" ON "CustomerVehicle"("registration");

-- CreateIndex
CREATE INDEX "CustomerVehicle_customerId_idx" ON "CustomerVehicle"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Dealership_mobile_key" ON "Dealership"("mobile");

-- CreateIndex
CREATE INDEX "Dealership_customerVehicleId_idx" ON "Dealership"("customerVehicleId");

-- CreateIndex
CREATE INDEX "Dealership_customerId_idx" ON "Dealership"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProtectionPlanAvailed_invoice_key" ON "ProtectionPlanAvailed"("invoice");

-- CreateIndex
CREATE UNIQUE INDEX "ProtectionPlanAvailed_receipt_key" ON "ProtectionPlanAvailed"("receipt");

-- CreateIndex
CREATE INDEX "ProtectionPlanAvailed_customerId_idx" ON "ProtectionPlanAvailed"("customerId");

-- CreateIndex
CREATE INDEX "ProtectionPlanAvailed_customerVehicleId_idx" ON "ProtectionPlanAvailed"("customerVehicleId");

-- CreateIndex
CREATE INDEX "ProtectionPlanAvailed_dealershipId_idx" ON "ProtectionPlanAvailed"("dealershipId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerVehicle" ADD CONSTRAINT "CustomerVehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dealership" ADD CONSTRAINT "Dealership_customerVehicleId_fkey" FOREIGN KEY ("customerVehicleId") REFERENCES "CustomerVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dealership" ADD CONSTRAINT "Dealership_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectionPlanAvailed" ADD CONSTRAINT "ProtectionPlanAvailed_protectionPlanId_fkey" FOREIGN KEY ("protectionPlanId") REFERENCES "ProtectionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectionPlanAvailed" ADD CONSTRAINT "ProtectionPlanAvailed_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectionPlanAvailed" ADD CONSTRAINT "ProtectionPlanAvailed_customerVehicleId_fkey" FOREIGN KEY ("customerVehicleId") REFERENCES "CustomerVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectionPlanAvailed" ADD CONSTRAINT "ProtectionPlanAvailed_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtectionPlan" ADD CONSTRAINT "ProtectionPlan_planTermId_fkey" FOREIGN KEY ("planTermId") REFERENCES "PlanTerms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
