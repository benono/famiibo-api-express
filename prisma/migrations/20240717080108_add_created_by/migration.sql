/*
  Warnings:

  - Added the required column `createdById` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Payee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payee" ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payee" ADD CONSTRAINT "Payee_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
