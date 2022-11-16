import fs from "fs";
import { BankActivitySeeder } from "./accounting/bank-activity-seeder";
import { UserChainSeeder } from "./dacchain/user-chain-seeder";
import { UserTransactionSeeder } from "./dacchain/user-transaction-seeder";
import { TenantSeeder } from "./identity/tenant-seeder";
import { IdentityUserSeeder } from './identity/user-seeder'
import minimist from "minimist";
import initApp from "../app/init-context";
import { Container } from 'typedi'
import { UserService } from "../services/identity/UserService";
import { ClientSeeder } from "./oauth2/client-seeder";
import Logger from "../lib/Logger";

const logger = Logger(module)


export interface Seeder {
    setup(file: string): void;
    tearDown(): void;
}


const main = async () => {

    const argv = minimist(process.argv.slice(2));
    logger.info("start seeder:", __dirname);
    logger.info(argv);

    const appCtxt = initApp("seeder");
    for (const file of ["../app/init-db"]) {
        await require(file).default(appCtxt);
    }

    
    
    const fileLoaders = [
        { cmd:"users", fileName: "seed-data/identity/users.ts", seeder: Container.get(IdentityUserSeeder) },
        { cmd:"tenants", fileName: "seed-data/identity/tenants.csv", seeder: Container.get(TenantSeeder) },
        { cmd:"activity", fileName: "seed-data/accounting/", seeder: Container.get(BankActivitySeeder) },
        { cmd:"w3chains", fileName: "seed-data/dacchain/user-chain.ts", seeder: Container.get(UserChainSeeder) },
        { cmd:"w3activity", fileName: "seed-data/dacchain/user-transactions.ts", seeder: Container.get(UserTransactionSeeder) },
        { cmd:"oauthclients", fileName: "seed-data/oauth2/clients.ts", seeder: Container.get(ClientSeeder) },
    ];
    let all = true;
    fileLoaders.forEach(l=>{
        if(argv[l.cmd]) {all=false}
    })

    if( all || argv["all"] ) {
        fileLoaders.forEach(l=>argv[l.cmd]=true)        
    }

    if( argv["clean"] ) {
        for (var v of fileLoaders.reverse() ) {
            if( argv[v.cmd] ) {
                logger.info("clean up:",v.fileName)
                await v.seeder.tearDown()
            }            
        }    
    } else {
        for (var v of fileLoaders) {
            if ( argv[v.cmd] ) {
                await v.seeder.setup(v.fileName)
            }            
        }
    }
    
    logger.info("seeder done");
}

main().catch((e) => {
    logger.error("seeder error:", e)
})