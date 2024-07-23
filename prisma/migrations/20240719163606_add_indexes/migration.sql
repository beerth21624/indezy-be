-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Factory_name_idx" ON "Factory"("name");

-- CreateIndex
CREATE INDEX "Factory_companyId_idx" ON "Factory"("companyId");

-- CreateIndex
CREATE INDEX "Machine_name_idx" ON "Machine"("name");

-- CreateIndex
CREATE INDEX "Machine_type_idx" ON "Machine"("type");

-- CreateIndex
CREATE INDEX "Machine_productionLineId_idx" ON "Machine"("productionLineId");

-- CreateIndex
CREATE INDEX "Machine_installationDate_idx" ON "Machine"("installationDate");

-- CreateIndex
CREATE INDEX "MachineHourMeterTotal_machineId_idx" ON "MachineHourMeterTotal"("machineId");

-- CreateIndex
CREATE INDEX "MachineHourMeterTotal_date_idx" ON "MachineHourMeterTotal"("date");

-- CreateIndex
CREATE INDEX "MachineStatusSegment_machineId_idx" ON "MachineStatusSegment"("machineId");

-- CreateIndex
CREATE INDEX "MachineStatusSegment_status_idx" ON "MachineStatusSegment"("status");

-- CreateIndex
CREATE INDEX "MachineStatusSegment_startDatetime_endDatetime_idx" ON "MachineStatusSegment"("startDatetime", "endDatetime");

-- CreateIndex
CREATE INDEX "MaintenanceTask_machineId_idx" ON "MaintenanceTask"("machineId");

-- CreateIndex
CREATE INDEX "MaintenanceTask_status_idx" ON "MaintenanceTask"("status");

-- CreateIndex
CREATE INDEX "MaintenanceTask_dueDate_idx" ON "MaintenanceTask"("dueDate");

-- CreateIndex
CREATE INDEX "MaintenanceTask_assignedUserId_idx" ON "MaintenanceTask"("assignedUserId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "PowerMetric_machineId_idx" ON "PowerMetric"("machineId");

-- CreateIndex
CREATE INDEX "PowerMetric_timestamp_idx" ON "PowerMetric"("timestamp");

-- CreateIndex
CREATE INDEX "ProductionLine_name_idx" ON "ProductionLine"("name");

-- CreateIndex
CREATE INDEX "ProductionLine_factoryId_idx" ON "ProductionLine"("factoryId");

-- CreateIndex
CREATE INDEX "SparePart_machineId_idx" ON "SparePart"("machineId");

-- CreateIndex
CREATE INDEX "SparePart_name_idx" ON "SparePart"("name");

-- CreateIndex
CREATE INDEX "SparePart_sku_idx" ON "SparePart"("sku");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");
