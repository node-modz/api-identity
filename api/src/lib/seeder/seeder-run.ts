import minimist from "minimist";
import { __SERVER_CONFIG__ } from '../../api-config';
import initApp from "../../app/init-context";
import db from '../../app/init-db';
import Logger from "../Logger";
import { Seeder } from "./Seeder";
const logger = Logger(module)

const main = async () => {

    const argv = minimist(process.argv.slice(2));
    logger.info("start seeder:", __dirname);
    logger.info(argv);

    const appCtxt = initApp("seeder");
    await db(appCtxt,__SERVER_CONFIG__.db);

    // for (const file of ["../app/init-db"]) {
    //     await require(file).default(appCtxt);
    // }

    // const fileLoaders = [
    //     { cmd: "users", fileName: "dist/seed-data/identity/users.ts", seeder: Container.get(IdentityUserSeeder) },
    //     { cmd: "tenants", fileName: "dist/seed-data/identity/tenants.csv", seeder: Container.get(TenantSeeder) },
    //     { cmd: "activity", fileName: "dist/seed-data/accounting/", seeder: Container.get(BankActivitySeeder) },
    //     { cmd: "w3chains", fileName: "dist/seed-data/dacchain/user-chain.ts", seeder: Container.get(UserChainSeeder) },
    //     { cmd: "w3activity", fileName: "dist/seed-data/dacchain/user-transactions.ts", seeder: Container.get(UserTransactionSeeder) },
    //     { cmd: "oauthclients", fileName: "dist/seed-data/oauth2/clients.ts", seeder: Container.get(ClientSeeder) },
    // ];
    const loaderFile = process.cwd() + "/" + argv["loaders"].replace(/\.[^/.]+$/, "")
    const fileLoaders = require(loaderFile).fileLoaders as {cmd:string,fileName:string,seeder:Seeder}[];    

    let all = true;
    fileLoaders.forEach(l => {
        if (argv[l.cmd]) { all = false }
    })

    if (all || argv["all"]) {
        fileLoaders.forEach(l => argv[l.cmd] = true)
    }

    if (argv["clean"]) {
        for (var v of fileLoaders.reverse()) {
            if (argv[v.cmd]) {
                logger.info("clean up:", v.fileName)
                await v.seeder.tearDown()
            }
        }
    } else {
        for (var v of fileLoaders) {
            if (argv[v.cmd]) {
                await v.seeder.setup(v.fileName)
            }
        }
    }

    logger.info("seeder done");
}

main().catch((e) => {
    logger.error("seeder error:", e)
})