import { randomUUID } from 'crypto';
import * as process from 'process';
import { Service } from 'typedi';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Logger from "../../../lib/core/logger/Logger";
import { Seeder } from '../../../lib/core/seeder/Seeder';
import { AuthCode } from '../entities/oauth2/AuthCode';
import { Client } from '../entities/oauth2/Client';
import { Scope } from '../entities/oauth2/Scope';
import { Token } from '../entities/oauth2/Token';
import { GrantIdentifier } from '../lib/oauth2';

const logger = Logger(module)

type ClientData = {
    id:string,
    name:string, 
    secret:string,
    redirectUris: string[],
    allowedGrants: GrantIdentifier[],
    scopes: {name:string}[]
}

@Service()
export class ClientSeeder implements Seeder {

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>

    async setup(file: string): Promise<void> {
        console.log("seeding oauth2: client data");
        if (!file.endsWith(".ts")) {
            throw new Error(`unknown file type, expecting .ts file: ${file}`);
        }
        logger.info(process.cwd())
        logger.info(__dirname)
        const data = require(process.cwd() + "/" + file.replace(/\.[^/.]+$/, "")).default as ClientData[];

        for ( var c of data) {
            let client = await this.clientRepo.findOne({
                where : {
                    name: c.name
                }
            });
            const scopes: Scope[] = [];
            for ( var s of c.scopes ) {
                let ds = await Scope.findOne({where:{name:s.name}})
                if ( !ds ) {
                    ds = await Scope.create({
                        name:s.name
                    }).save()
                    scopes.push(ds);
                } else {
                    scopes.push(ds);
                }
            }

            if( !client ) {
                client = await Client.create({
                    id:(!c.id) ? randomUUID() : c.id,
                    name:c.name,
                    secret:c.secret,
                    redirectUris:c.redirectUris,                    
                    allowedGrants:c.allowedGrants,
                    scopes:scopes,
                }).save();
                if( !client ) {
                    logger.error("unable to save client")
                }
            }
        }
    }
    async tearDown(): Promise<void> {
        const qb = getConnection().createQueryBuilder()
        ;(await Client.find()).forEach(c=>{
            logger.info("deleting: ", c);
            c.scopes = [];
            c.save();
        });
        await qb.delete().from(Token).execute();
        await qb.delete().from(AuthCode).execute();
        await qb.delete().from(Scope).execute();
        await qb.delete().from(Client).execute();
    }
    
} 