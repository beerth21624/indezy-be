/*
  Warnings:

  - You are about to drop the column `temperature` on the `PowerMetric` table. All the data in the column will be lost.
  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `MachineStatusSegment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group` to the `MachineStatusSegment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `MachineStatusSegment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'TECHNICIAN';

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_machineId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "record_status" TEXT DEFAULT 'A';

-- AlterTable
ALTER TABLE "Factory" ADD COLUMN     "record_status" TEXT DEFAULT 'A';

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "record_status" TEXT DEFAULT 'A';

-- AlterTable
ALTER TABLE "MachineStatusSegment" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "group" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PowerMetric" DROP COLUMN "temperature";

-- AlterTable
ALTER TABLE "ProductionLine" ADD COLUMN     "record_status" TEXT DEFAULT 'A';

-- DropTable
DROP TABLE "Alert";

-- DropEnum
DROP TYPE "AlertSeverity";

-- DropEnum
DROP TYPE "AlertType";

-- DropEnum
DROP TYPE "MachineStatus";

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

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
