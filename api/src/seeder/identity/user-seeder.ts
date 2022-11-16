import * as process from 'process';
import { Inject, Service } from 'typedi';
import { getConnection } from "typeorm";
import { Login, Tenant, User, IdpConnect } from "../../entities/identity/index";
import { AuthService } from "../../services/identity/AuthService";
import { Seeder } from "../seeder";
import Logger from "../../lib/Logger";

const logger = Logger(module)


type UserData = {
    email: string, firstName: string, lastName: string, password: string, avatar:string    
}

@Service()
export class IdentityUserSeeder implements Seeder {

    @Inject()
    private authService: AuthService

    async setup(file: string): Promise<void> {

        if (!file.endsWith(".ts")) {
            throw new Error(`unknown file type, expecting .ts file: ${file}`);
        }

        //const authService = new AuthService()

        logger.info(process.cwd())
        logger.info(__dirname)
        const data = require(process.cwd() + "/" + file.replace(/\.[^/.]+$/, "")).default as UserData[];

        logger.info(data);
        //if( true ) return;
        for (var u of data) {
            let user = await User.findOne({
                where: {
                    email: u.email,
                },
            });
            if (!user) {
                user = await this.authService.createLogin({
                    username: u.email,
                    email: u.email,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    password: u.password,
                    avatar:u.avatar,
                })
            }
        }

    }
    async tearDown(): Promise<void> {
        const qb = getConnection().createQueryBuilder()
        await qb.delete().from(Login).execute();
        await qb.delete().from(IdpConnect).execute();        
        await qb.delete().from(User).execute();                
        await qb.delete().from(Tenant).execute();        
    }

}