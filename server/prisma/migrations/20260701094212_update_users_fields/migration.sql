-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "lastViewedAt" TIMESTAMP(3);
