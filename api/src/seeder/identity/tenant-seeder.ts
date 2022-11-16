import { Tenant } from "../../entities/identity";
import { CsvProcessor } from "../csv-processor";
import { Seeder } from "../seeder";
import { createConnection, Db, getConnection, QueryRunner } from "typeorm";
import { Service } from 'typedi';
import Logger from "../../lib/Logger";

const logger = Logger(module)

@Service()
export class TenantSeeder implements Seeder {
    async setup(file: string): Promise<void> {
        const csvloader = new CsvProcessor();
        await csvloader.loadCSV(
            file,
            {
                Description: "description",
                ShortName: "name",
            },
            async (obj) => {
                logger.info(obj);
                return Tenant.create({
                    name: obj["name"],
                    description: obj["description"],
                }).save();
            }
        );
    }
    async tearDown(): Promise<void> {
        // await getConnection()
        //     .createQueryBuilder()
        //     .delete()
        //     .from(Tenant)
        //     .execute();
    }

}