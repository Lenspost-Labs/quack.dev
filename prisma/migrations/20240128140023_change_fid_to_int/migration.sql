/*
  Warnings:

  - The `fid` column on the `user_metadata` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_metadata" DROP COLUMN "fid",
ADD COLUMN     "fid" INTEGER;
