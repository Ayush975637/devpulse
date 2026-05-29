-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "github_id" INTEGER NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "name" VARCHAR(200),
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "following" INTEGER NOT NULL DEFAULT 0,
    "public_repos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "snapshot_date" DATE NOT NULL,
    "total_stars" INTEGER DEFAULT 0,
    "top_languages" JSONB,
    "commits_by_day" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repositories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "github_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "language" VARCHAR(100),
    "stars" INTEGER DEFAULT 0,
    "forks" INTEGER DEFAULT 0,
    "updated_at" TIMESTAMP(6),
    "description" TEXT,
    "homepage" TEXT,
    "repo_url" TEXT NOT NULL,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "devScore" INTEGER NOT NULL,
    "stats" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_github_id_key" ON "users"("github_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "idx_users_username" ON "users"("username");

-- CreateIndex
CREATE INDEX "idx_snapshots_user_date" ON "snapshots"("user_id", "snapshot_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "snapshots_user_id_snapshot_date_key" ON "snapshots"("user_id", "snapshot_date");

-- CreateIndex
CREATE INDEX "idx_repos_user_id" ON "repositories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_user_id_github_id_key" ON "repositories"("user_id", "github_id");

-- CreateIndex
CREATE UNIQUE INDEX "stats_user_id_key" ON "stats"("user_id");

-- CreateIndex
CREATE INDEX "stats_user_id_idx" ON "stats"("user_id");

-- AddForeignKey
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stats" ADD CONSTRAINT "stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
