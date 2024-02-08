-- AlterTable
ALTER TABLE "user_metadata" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "user_posts" (
    "id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "user_posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_posts" ADD CONSTRAINT "user_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
