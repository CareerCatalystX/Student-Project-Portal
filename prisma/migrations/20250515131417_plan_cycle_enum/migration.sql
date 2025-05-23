/*
  Warnings:

  - The `billingCycle` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PlanCycle" AS ENUM ('MONTHLY', 'YEARLY', 'FREE');

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "billingCycle",
ADD COLUMN     "billingCycle" "PlanCycle" NOT NULL DEFAULT 'FREE';
