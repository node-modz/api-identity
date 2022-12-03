import minimist from "minimist";
import Container from "typedi";
import initApp from "../core/init-context";
import Logger from "../logger/Logger";
import { Seeder } from "./Seeder";
const logger = Logger(module)

const main = async () => {

    const argv = minimist(process.argv.slice(2));
    logger.info("start seeder:", __dirname);
    logger.info(argv);

    const file = argv["init"];
    const rfile = (file) ? process.cwd() + "/" + file.replace(/\.[^/.]+$/, "") : '';
    if (!file) {
        logger.error("server config missing: --init <file>")
        return;
    }
    logger.info("starting seeder using config:", rfile);

    const descendentProperty = (obj: any, desc: string) => {
        var arr = desc.split(".");
        while (arr.length && (obj = obj[arr.shift() as string]));
        return obj;
    }
    
    const config = require(rfile).__SERVER_CONFIG__;

    logger.info("loading config");
    /**
     * initialize config.
     */
    for (const attr of config.config as { prop: string, container_ref: string }[]) {
        Container.set(
            attr.container_ref,
            descendentProperty(config, attr.prop));
    }

    for (const attr of config.config as { prop: string, container_ref: string }[]) {
        logger.info(` prop: ${attr.container_ref}`, Container.get(attr.container_ref));
    }

    /**
     * run all initializers
     */
    const appCtxt = initApp("ledgers-api");
    for (const mod of config.setup as { init: string, config: string }[]) {
        logger.info("loading ", mod.init);
        await require(process.cwd() + "/"+mod.init).default(appCtxt)
    }

    const loaderFile = process.cwd() + "/" + argv["loaders"].replace(/\.[^/.]+$/, "")

    logger.info("loading from seed-loaders file",loaderFile);
    const resolvedLoader = require(loaderFile)
    const seedLoaders = resolvedLoader.seedLoaders as { cmd: string, fileName: string, seeder: Seeder }[];
    
    let all = true;
    seedLoaders.forEach(l => {
        if (argv[l.cmd]) { all = false }
    })

    if (all || argv["all"]) {
        seedLoaders.forEach(l => argv[l.cmd] = true)
    }

    const doClean = async () => {
        for (var v of seedLoaders.reverse()) {
            if (argv[v.cmd]) {
                logger.info("clean up:", v.fileName)                
                await v.seeder.tearDown()
            }
        }
    }
    const doLoad = async () => {
        for (var v of seedLoaders) {
            if (argv[v.cmd]) {                
                await v.seeder.setup(v.fileName)
            }
        }
    }

    if (argv["clean"]) {
        await doClean();
    } else {
        await doLoad();
    }

    logger.info("seeder done");
}

main().catch((e) => {
    logger.error("seeder error:", e)
})