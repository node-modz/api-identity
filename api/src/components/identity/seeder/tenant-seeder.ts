import { Service } from 'typedi';
import Logger from "../../../lib/logger/Logger";
import { CsvProcessor } from "../../../lib/seeder/csv-processor";
import { Seeder } from '../../../lib/seeder/Seeder';
import { Tenant } from "../entities/identity";

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