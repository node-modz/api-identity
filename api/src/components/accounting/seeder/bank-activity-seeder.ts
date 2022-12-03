
import csv from "csv-parser";
import fs from "fs";
import moment from "moment";
import { Service } from 'typedi';
import { getConnection } from "typeorm";
import Logger from "../../../lib/core/logger/Logger";
import { Seeder } from "../../../lib/core/seeder/Seeder";
import {
    ActivityType,
    BankActivity
} from "../entities/BankActivity";

const logger = Logger(module)

@Service()
export class BankActivitySeeder implements Seeder {
    async setup(path: string): Promise<void> {
        const files = fs.readdirSync(path)
        console.log("all files;", files)
        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            if (file.endsWith(".csv")) {
                await this.seedBankActivity(path + file);
            }
        };
    }
    async tearDown(): Promise<void> {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(BankActivity)
            .execute();
    }

    seedBankActivity = async (file: string) => {
        const dataList: {
            activityDate: Date;
            amount: number;
            activityType: ActivityType;
            description: string;
        }[] = [];

        //TODO: i was hoping that this would be sequential, but it doesn't look like it is
        // - it became sequential after returning the promise & await on the outside.

        const promise = new Promise((resolve, _) => {
            logger.info("Loading file:", file);
            fs.createReadStream(file)
                .pipe(csv({}))
                .on("data", async (data: any) => {
                    if (data["Tran Date"] === "Tran Date") {
                        // header line
                    } else {
                        const activity = {
                            activityDate: moment(data["Tran Date"], "DD-MM-YYYY").toDate(),
                            amount:
                                data["CR"].trim().length > 0
                                    ? parseFloat(data["CR"].trim())
                                    : parseFloat(data["DR"].trim()),
                            activityType:
                                data["CR"].trim().length > 0
                                    ? ActivityType.Deposit
                                    : ActivityType.Withdrawal,
                            description: data["PARTICULARS"],
                        };
                        dataList.push(activity);
                    }
                })
                .on("end", async () => {
                    for (var activity of dataList) {
                        //console.log(activity);
                        const ba = await BankActivity.create(activity).save();
                    }
                    resolve("completed");
                });
        }).then((val) => {
            logger.info("Loading file:", file, ": ", val);
        });

        return promise
    };
}