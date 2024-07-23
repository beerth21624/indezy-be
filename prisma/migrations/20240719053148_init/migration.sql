/*
  Warnings:

  - You are about to drop the column `code` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `SparePart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `SparePart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `installationDate` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productionLineId` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Machine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Machine_code_key";

-- DropIndex
DROP INDEX "SparePart_code_key";

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "code",
DROP COLUMN "description",
ADD COLUMN     "installationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "productionLineId" TEXT NOT NULL,
ADD COLUMN     "record_status" TEXT DEFAULT 'A',
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SparePart" DROP COLUMN "code",
ADD COLUMN     "detail" TEXT,
ADD COLUMN     "installationDate" TIMESTAMP(3),
ADD COLUMN     "lifespan" INTEGER,
ADD COLUMN     "maintenanceInterval" INTEGER,
ADD COLUMN     "remainingLifespan" INTEGER,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "unit" INTEGER;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "record_status" TEXT DEFAULT 'A',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "record_status" TEXT DEFAULT 'A',

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionLine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "record_status" TEXT DEFAULT 'A',

    CONSTRAINT "ProductionLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineStatusSegment" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDatetime" TIMESTAMP(3) NOT NULL,
    "endDatetime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineStatusSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineHourMeterTotal" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "normal" INTEGER NOT NULL,
    "stop" INTEGER NOT NULL,
    "risk" INTEGER NOT NULL,
    "abnormal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineHourMeterTotal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PowerMetric" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "currentAvg" DOUBLE PRECISION NOT NULL,
    "voltageV31" DOUBLE PRECISION NOT NULL,
    "activePowerW3" DOUBLE PRECISION NOT NULL,
    "powerFactorPf2" DOUBLE PRECISION NOT NULL,
    "currentDemandDa1" DOUBLE PRECISION NOT NULL,
    "voltageAverageVll" DOUBLE PRECISION NOT NULL,
    "activePowerT" DOUBLE PRECISION NOT NULL,
    "powerFactorPf3" DOUBLE PRECISION NOT NULL,
    "currentDemandDa2" DOUBLE PRECISION NOT NULL,
    "voltageV1n" DOUBLE PRECISION NOT NULL,
    "reactivePowerVar1" DOUBLE PRECISION NOT NULL,
    "powerFactorT" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "currentDemandDa3" DOUBLE PRECISION NOT NULL,
    "voltageV2n" DOUBLE PRECISION NOT NULL,
    "reactivePowerVar2" DOUBLE PRECISION NOT NULL,
    "frequencyHz" DOUBLE PRECISION NOT NULL,
    "currentA1" DOUBLE PRECISION NOT NULL,
    "currentDemandDan" DOUBLE PRECISION NOT NULL,
    "voltageV3n" DOUBLE PRECISION NOT NULL,
    "reactivePowerVar3" DOUBLE PRECISION NOT NULL,
    "harmonicCurrentHiT" DOUBLE PRECISION NOT NULL,
    "currentA2" DOUBLE PRECISION NOT NULL,
    "currentDemandDavg" DOUBLE PRECISION NOT NULL,
    "voltageAverageVln" DOUBLE PRECISION NOT NULL,
    "reactivePowerT" DOUBLE PRECISION NOT NULL,
    "harmonicVoltageHvT" DOUBLE PRECISION NOT NULL,
    "currentA3" DOUBLE PRECISION NOT NULL,
    "voltageV12" DOUBLE PRECISION NOT NULL,
    "activePowerW1" DOUBLE PRECISION NOT NULL,
    "powerFactorPf1" DOUBLE PRECISION NOT NULL,
    "currentAn" DOUBLE PRECISION NOT NULL,
    "voltageV23" DOUBLE PRECISION NOT NULL,
    "activePowerW2" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PowerMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SparePart_sku_key" ON "SparePart"("sku");

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLine" ADD CONSTRAINT "ProductionLine_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_productionLineId_fkey" FOREIGN KEY ("productionLineId") REFERENCES "ProductionLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineStatusSegment" ADD CONSTRAINT "MachineStatusSegment_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineHourMeterTotal" ADD CONSTRAINT "MachineHourMeterTotal_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerMetric" ADD CONSTRAINT "PowerMetric_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
