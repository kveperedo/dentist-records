/*
  Warnings:

  - You are about to alter the column `fees` on the `TreatmentEntry` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "TreatmentEntry" ALTER COLUMN "fees" SET DATA TYPE DOUBLE PRECISION;
