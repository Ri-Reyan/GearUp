-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'provider', 'admin');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "tags" VARCHAR(80) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gear_categories" (
    "id" TEXT NOT NULL,
    "gear_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gear_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gear_inventory" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "img" VARCHAR(100) NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "brand" VARCHAR(20) NOT NULL,
    "availability" "Availability" NOT NULL DEFAULT 'IN_STOCK',
    "owner_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gear_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_order" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "location" VARCHAR(100) NOT NULL,
    "gear_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gear_categories_gear_id_key" ON "gear_categories"("gear_id");

-- CreateIndex
CREATE UNIQUE INDEX "gear_categories_category_id_key" ON "gear_categories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "gear_categories_gear_id_category_id_key" ON "gear_categories"("gear_id", "category_id");

-- AddForeignKey
ALTER TABLE "gear_categories" ADD CONSTRAINT "gear_categories_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "gear_inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gear_categories" ADD CONSTRAINT "gear_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gear_inventory" ADD CONSTRAINT "gear_inventory_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_order" ADD CONSTRAINT "rental_order_gear_id_fkey" FOREIGN KEY ("gear_id") REFERENCES "gear_inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_order" ADD CONSTRAINT "rental_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
