-- AlterTable
ALTER TABLE "user_metadata" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "fid" TEXT,
ADD COLUMN     "image" TEXT DEFAULT 'https://api.dicebear.com/7.x/pixel-art/svg?seed={{user_id}}';
