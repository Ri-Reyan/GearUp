/*
  Warnings:

  - Added the required column `returnDate` to the `rental_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_order" ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL;
