/*
  Warnings:

  - You are about to drop the column `commits_by_day` on the `snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `top_languages` on the `snapshots` table. All the data in the column will be lost.
  - Made the column `user_id` on table `snapshots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_stars` on table `snapshots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `snapshots` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "snapshots" DROP COLUMN "commits_by_day",
DROP COLUMN "top_languages",
ADD COLUMN     "activeDaysCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "activeWeeks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "activityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "currentStreakDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "diversityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "followers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "impactScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "longestStreakDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "percentile" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reachScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "repositoryScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalCommits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalContributionsYear" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalForks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRepos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWatches" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "total_stars" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;
