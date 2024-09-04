-- DropForeignKey
ALTER TABLE "conf_customer_data" DROP CONSTRAINT "conf_customer_data_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "conf_customer_data" DROP CONSTRAINT "conf_customer_data_occ_id_fkey";

-- AddForeignKey
ALTER TABLE "conf_customer_data" ADD CONSTRAINT "conf_customer_data_occ_id_fkey" FOREIGN KEY ("occ_id") REFERENCES "custom_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conf_customer_data" ADD CONSTRAINT "conf_customer_data_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
