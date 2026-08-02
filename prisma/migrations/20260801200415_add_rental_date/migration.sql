/*
  Warnings:

  - You are about to drop the `rental_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_rental_order_id_fkey";

-- DropForeignKey
ALTER TABLE "rental_order" DROP CONSTRAINT "rental_order_gear_id_fkey";

-- DropForeignKey
ALTER TABLE "rental_order" DROP CONSTRAINT "rental_order_user_id_fkey";

-- DropTable
DROP TABLE "rental_order";

-- CreateTable
CREATE TABLE "RentalOrder" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "rentalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "gearId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_rental_order_id_fkey" FOREIGN KEY ("rental_order_id") REFERENCES "RentalOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOrder" ADD CONSTRAINT "RentalOrder_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "gear_inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOrder" ADD CONSTRAINT "RentalOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
