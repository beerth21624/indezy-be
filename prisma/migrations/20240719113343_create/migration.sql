/*
  Warnings:

  - The values [TECHNICIAN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `record_status` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `record_status` on the `Factory` table. All the data in the column will be lost.
  - You are about to drop the column `record_status` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `MachineStatusSegment` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `MachineStatusSegment` table. All the data in the column will be lost.
  - You are about to drop the column `record_status` on the `ProductionLine` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `MachineStatusSegment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `temperature` to the `PowerMetric` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('NORMAL', 'WARNING', 'CRITICAL', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('MAINTENANCE', 'PERFORMANCE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'MANAGER', 'OPERATOR');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "record_status";

-- AlterTable
ALTER TABLE "Factory" DROP COLUMN "record_status";

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "record_status";

-- AlterTable
ALTER TABLE "MachineStatusSegment" DROP COLUMN "description",
DROP COLUMN "group",
DROP COLUMN "status",
ADD COLUMN     "status" "MachineStatus" NOT NULL;

-- AlterTable
ALTER TABLE "PowerMetric" ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ProductionLine" DROP COLUMN "record_status";

-- DropTable
DROP TABLE "Notification";

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
