/*
  Warnings:

  - You are about to drop the column `firstName` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `postCode` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `postCode` on the `owners` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `owners` table. All the data in the column will be lost.
  - You are about to drop the `relations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `owners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `first_name` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_code` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_code` to the `owners` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConfConst" AS ENUM ('text', 'int', 'boolean');

-- DropForeignKey
ALTER TABLE "relations" DROP CONSTRAINT "relations_customerId_fkey";

-- DropForeignKey
ALTER TABLE "relations" DROP CONSTRAINT "relations_ownerId_fkey";

-- DropIndex
DROP INDEX "customers_userId_key";

-- DropIndex
DROP INDEX "owners_userId_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "postCode",
DROP COLUMN "userId",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "post_code" INTEGER NOT NULL,
ADD COLUMN     "user_id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "owners" DROP COLUMN "postCode",
DROP COLUMN "userId",
ADD COLUMN     "post_code" INTEGER NOT NULL,
ADD COLUMN     "user_id" SERIAL NOT NULL;

-- DropTable
DROP TABLE "relations";

-- CreateTable
CREATE TABLE "owner_to_customer_relations" (
    "owner_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "address_disp" BOOLEAN NOT NULL,
    "birthday_disp" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owner_to_customer_relations_pkey" PRIMARY KEY ("owner_id","customer_id")
);

-- CreateTable
CREATE TABLE "custom_configurations" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "configuration_title" TEXT NOT NULL,
    "configurationConstraint" "ConfConst" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conf_customer_data" (
    "occ_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "configuration_data" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conf_customer_data_pkey" PRIMARY KEY ("occ_id","customer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_key" ON "customers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "owners_user_id_key" ON "owners"("user_id");

-- AddForeignKey
ALTER TABLE "owner_to_customer_relations" ADD CONSTRAINT "owner_to_customer_relations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_to_customer_relations" ADD CONSTRAINT "owner_to_customer_relations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_configurations" ADD CONSTRAINT "custom_configurations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conf_customer_data" ADD CONSTRAINT "conf_customer_data_occ_id_fkey" FOREIGN KEY ("occ_id") REFERENCES "custom_configurations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conf_customer_data" ADD CONSTRAINT "conf_customer_data_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
