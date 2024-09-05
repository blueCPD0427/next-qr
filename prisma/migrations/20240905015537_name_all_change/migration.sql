/*
  Warnings:

  - You are about to drop the column `owner_id` on the `custom_configurations` table. All the data in the column will be lost.
  - You are about to drop the `conf_customer_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner_to_customer_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owners` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `master_id` to the `custom_configurations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "conf_customer_data" DROP CONSTRAINT "conf_customer_data_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "conf_customer_data" DROP CONSTRAINT "conf_customer_data_occ_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_configurations" DROP CONSTRAINT "custom_configurations_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "owner_to_customer_relations" DROP CONSTRAINT "owner_to_customer_relations_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "owner_to_customer_relations" DROP CONSTRAINT "owner_to_customer_relations_owner_id_fkey";

-- AlterTable
ALTER TABLE "custom_configurations" DROP COLUMN "owner_id",
ADD COLUMN     "master_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "conf_customer_data";

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "owner_to_customer_relations";

-- DropTable
DROP TABLE "owners";

-- CreateTable
CREATE TABLE "masters" (
    "id" TEXT NOT NULL,
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_code" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "user_id" SERIAL NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "sex" "Sex",
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "post_code" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_to_member_relations" (
    "master_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "address_disp" BOOLEAN NOT NULL,
    "birthday_disp" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_to_member_relations_pkey" PRIMARY KEY ("master_id","member_id")
);

-- CreateTable
CREATE TABLE "conf_member_data" (
    "occ_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "configuration_data" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conf_member_data_pkey" PRIMARY KEY ("occ_id","member_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "masters_user_id_key" ON "masters"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "masters_email_key" ON "masters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_key" ON "members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- AddForeignKey
ALTER TABLE "master_to_member_relations" ADD CONSTRAINT "master_to_member_relations_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "masters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_to_member_relations" ADD CONSTRAINT "master_to_member_relations_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_configurations" ADD CONSTRAINT "custom_configurations_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "masters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conf_member_data" ADD CONSTRAINT "conf_member_data_occ_id_fkey" FOREIGN KEY ("occ_id") REFERENCES "custom_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conf_member_data" ADD CONSTRAINT "conf_member_data_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
