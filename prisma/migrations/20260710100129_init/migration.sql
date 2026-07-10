/*
  Warnings:

  - A unique constraint covering the columns `[tags]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "gear_categories_category_id_key";

-- DropIndex
DROP INDEX "gear_categories_gear_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "categories_tags_key" ON "categories"("tags");
