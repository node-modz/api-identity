import { Login, User } from "../../entities/identity";
import { Service, Inject } from 'typedi';
import { Repository } from "typeorm";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { LoginService } from "./LoginService";
import { IdpConnect } from '../../entities/identity/IdpConnect';
import passport from 'passport';
import { getConnection } from 'typeorm';
import Logger from "../../../../lib/core/logger/Logger";

const logger = Logger(module)

@Service()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @Inject()
        private readonly loginService: LoginService
        
    ) { }
    
    async findByCredentials(username:string,password:string): Promise<User|undefined>{
        const login = await this.loginService.isValid(username,password);
        if( !login ) {
            return undefined
        }
        return await this.findByLogin(login);
    }
    async findByUsername(username: string): Promise<User|undefined> {
        const login = await this.loginService.findByUsername(username);
        if ( !login ) {
            return undefined;
        }
        return this.findByLogin(login);
    }

    async findByLogin(login:Login) : Promise<User|undefined> {
        return await this.userRepo.findOne({
            where: {
                id: login.userId
            },
            relations: ["tenant"]
        })
    }
    async findById(id:string) : Promise<User|undefined> {
        return await this.userRepo.findOne({
            where: {
                id: id
            },
            relations: ["tenant"]
        })
    }

    async findByEmail(email:string) :Promise<User> {
        return await this.userRepo.findOneOrFail({
            where: {
                email: email
            },
            relations: ["tenant"]
        })
    }

    async IdpConnect(provider: string, profile: passport.Profile): Promise<IdpConnect> {
        const profilePic = (profile: passport.Profile): string => {
            if (profile.provider === "google") {
                return (profile as any)._json.picture
            } 
            else if (profile.provider === "github") {
                return (profile as any)._json.avatar_url
            } 
            else if(profile.provider === "w3l") {
                return (profile as any)._json.avatar
            }
            else return "";
        }
        
        const email = (profile: passport.Profile): string => {
            if (profile.provider === "google") {
                return (profile as any)._json.email
            }
            else if (profile.provider === "github") {
                return (!(profile as any)._json.email)
                    ? `${profile.id}@github.com`
                    : (profile as any)._json.email
            }
            else return `${profile.id}@${profile.provider}`;
        }
        
        logger.debug(`passport ${provider}: creating user: `, profile.id)
        const data = ('_raw' in profile) ? (profile as any)._raw : ""
    
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = (profile.provider==='w3l') 
            ? await queryRunner.manager.findOne(User,{where:{id:profile.id}})
            : await queryRunner.manager.save(User.create({
                lastName: profile.name?.familyName,
                firstName: profile.name?.givenName,
                email: email(profile),
                avatar: profilePic(profile)
            }));

            if( !user ) {
                throw new Error(`unable to find user:${profile.id}`);                
            }
            const socialConnect = queryRunner.manager.save(IdpConnect.create({
                provider: provider,
                providerId: profile.id,
                profileUrl: profilePic(profile),
                data: data,
                verified: true,
                userId: user.id
            }));
            // commit transaction now:
            await queryRunner.commitTransaction();
            return socialConnect;
        } catch (err) {
            // since we have errors let's rollback changes we made
            logger.error("unable to save txn:", err);
            await queryRunner.rollbackTransaction();
            throw new Error("unknown error:" + err);
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release()
        }
    }
}