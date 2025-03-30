/*
  Warnings:

  - A unique constraint covering the columns `[clerk_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScreenshotUpload" DROP CONSTRAINT "ScreenshotUpload_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerk_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- AddForeignKey
ALTER TABLE "ScreenshotUpload" ADD CONSTRAINT "ScreenshotUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
