/*
  Warnings:

  - Added the required column `certification` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `letterOfRecommendation` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `milestones` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfStudentsNeeded` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "certification" BOOLEAN NOT NULL,
ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "letterOfRecommendation" BOOLEAN NOT NULL,
ADD COLUMN     "milestones" TEXT NOT NULL,
ADD COLUMN     "numberOfStudentsNeeded" INTEGER NOT NULL,
ADD COLUMN     "preferredStudentDepartments" TEXT[];

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiresAt" TIMESTAMP(3);
