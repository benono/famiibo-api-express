-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "currencyId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
