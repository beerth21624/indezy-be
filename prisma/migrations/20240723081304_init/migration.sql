-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'TECHNICIAN', 'OPERATOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

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
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "installationDate" TIMESTAMP(3) NOT NULL,
    "productionLineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "record_status" TEXT DEFAULT 'A',

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "MaintenanceTask" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "priority" "Priority" NOT NULL,
    "assignedUserId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SparePart" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "detail" TEXT,
    "unit" INTEGER,
    "lifespan" INTEGER,
    "remainingLifespan" INTEGER,
    "maintenanceInterval" INTEGER,
    "installationDate" TIMESTAMP(3),
    "machineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "minimumQuantity" INTEGER NOT NULL,
    "lastReplaced" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SparePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Factory_name_idx" ON "Factory"("name");

-- CreateIndex
CREATE INDEX "Factory_companyId_idx" ON "Factory"("companyId");

-- CreateIndex
CREATE INDEX "ProductionLine_name_idx" ON "ProductionLine"("name");

-- CreateIndex
CREATE INDEX "ProductionLine_factoryId_idx" ON "ProductionLine"("factoryId");

-- CreateIndex
CREATE INDEX "Machine_name_idx" ON "Machine"("name");

-- CreateIndex
CREATE INDEX "Machine_type_idx" ON "Machine"("type");

-- CreateIndex
CREATE INDEX "Machine_productionLineId_idx" ON "Machine"("productionLineId");

-- CreateIndex
CREATE INDEX "Machine_installationDate_idx" ON "Machine"("installationDate");

-- CreateIndex
CREATE INDEX "MachineStatusSegment_machineId_idx" ON "MachineStatusSegment"("machineId");

-- CreateIndex
CREATE INDEX "MachineStatusSegment_status_idx" ON "MachineStatusSegment"("status");

-- CreateIndex
CREATE INDEX "MachineStatusSegment_startDatetime_endDatetime_idx" ON "MachineStatusSegment"("startDatetime", "endDatetime");

-- CreateIndex
CREATE INDEX "MachineHourMeterTotal_machineId_idx" ON "MachineHourMeterTotal"("machineId");

-- CreateIndex
CREATE INDEX "MachineHourMeterTotal_date_idx" ON "MachineHourMeterTotal"("date");

-- CreateIndex
CREATE INDEX "PowerMetric_machineId_idx" ON "PowerMetric"("machineId");

-- CreateIndex
CREATE INDEX "PowerMetric_timestamp_idx" ON "PowerMetric"("timestamp");

-- CreateIndex
CREATE INDEX "MaintenanceTask_machineId_idx" ON "MaintenanceTask"("machineId");

-- CreateIndex
CREATE INDEX "MaintenanceTask_status_idx" ON "MaintenanceTask"("status");

-- CreateIndex
CREATE INDEX "MaintenanceTask_dueDate_idx" ON "MaintenanceTask"("dueDate");

-- CreateIndex
CREATE INDEX "MaintenanceTask_assignedUserId_idx" ON "MaintenanceTask"("assignedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "SparePart_sku_key" ON "SparePart"("sku");

-- CreateIndex
CREATE INDEX "SparePart_machineId_idx" ON "SparePart"("machineId");

-- CreateIndex
CREATE INDEX "SparePart_name_idx" ON "SparePart"("name");

-- CreateIndex
CREATE INDEX "SparePart_sku_idx" ON "SparePart"("sku");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

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

-- AddForeignKey
ALTER TABLE "MaintenanceTask" ADD CONSTRAINT "MaintenanceTask_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceTask" ADD CONSTRAINT "MaintenanceTask_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
