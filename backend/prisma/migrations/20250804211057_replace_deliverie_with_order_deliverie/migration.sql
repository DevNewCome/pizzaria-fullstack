/*
  Warnings:

  - You are about to drop the column `deliverie_id` on the `items` table. All the data in the column will be lost.
  - You are about to drop the `deliveries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_deliverie_id_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "deliverie_id",
ADD COLUMN     "order_deliverie_id" TEXT;

-- DropTable
DROP TABLE "deliveries";

-- CreateTable
CREATE TABLE "orders_deliveries" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "adress" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "payment_method" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_deliveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_order_deliverie_id_fkey" FOREIGN KEY ("order_deliverie_id") REFERENCES "orders_deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
