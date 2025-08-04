-- AlterTable
ALTER TABLE "items" ADD COLUMN     "deliverie_id" TEXT;

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "table" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_deliverie_id_fkey" FOREIGN KEY ("deliverie_id") REFERENCES "deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
