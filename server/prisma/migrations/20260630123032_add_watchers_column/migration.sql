-- DropIndex
DROP INDEX "stats_user_id_idx";

-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "watchers" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "stats_devScore_idx" ON "stats"("devScore" DESC);
