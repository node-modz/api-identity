import fs from "fs";
import { BankActivitySeeder } from "./accounting/bank-activity-seeder";
import { UserChainSeeder } from "./dacchain/user-chain-seeder";
import { UserTransactionSeeder } from "./dacchain/user-transaction-seeder";
import { TenantSeeder } from "./identity/tenant-seeder";
import { IdentityUserSeeder } from './identity/user-seeder'
import minimist from "minimist";
import initApp from "../app/init-context";


export interface Seeder {
    setup(file: string): void;
    tearDown(): void;
}


const main = async () => {

    const argv = minimist(process.argv.slice(2));
    console.log("start seeder:", __dirname);
    console.dir(argv);

    const appCtxt = initApp("seeder");
    for (const file of ["../app/init-db"]) {
        await require(file).default(appCtxt);
    }
    
    const fileLoaders = [
        { fileName: "seed-data/identity/users.ts", seeder: new IdentityUserSeeder() },
        { fileName: "seed-data/identity/tenants.csv", seeder: new TenantSeeder() },
        { fileName: "seed-data/accounting/", seeder: new BankActivitySeeder() },
        { fileName: "seed-data/dacchain/user-chain.ts", seeder: new UserChainSeeder() },
        { fileName: "seed-data/dacchain/user-transactions.ts", seeder: new UserTransactionSeeder() },
    ]

    if( argv["clean"] ) {
        for (var v of fileLoaders.reverse() ) {
            console.log("clean up:",v.fileName)
            await v.seeder.tearDown()
        }    
    } else {
        for (var v of fileLoaders) {
            await v.seeder.setup(v.fileName)
        }
    }
    
    console.log("seeder done");
}

main().catch((e) => {
    console.error("seeder error:", e)
})