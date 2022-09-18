/*
  Warnings:

  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_recordId_fkey";

-- DropTable
DROP TABLE "Entry";

-- CreateTable
CREATE TABLE "TreatmentEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tooth" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "fees" DECIMAL(65,30) NOT NULL,
    "recordId" TEXT,

    CONSTRAINT "TreatmentEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TreatmentEntry" ADD CONSTRAINT "TreatmentEntry_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE SET NULL ON UPDATE CASCADE;
