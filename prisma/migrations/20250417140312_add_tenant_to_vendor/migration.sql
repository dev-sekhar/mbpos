/*
  Warnings:

  - Added the required column `tenantId` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vendor` ADD COLUMN `tenantId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Vendor` ADD CONSTRAINT `Vendor_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `Tenant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
