import { Login, User } from "../../entities/identity";
import { Service } from 'typedi';
import { Repository } from "typeorm";
import { InjectRepository } from 'typeorm-typedi-extensions';
import argon2 from "argon2";

@Service()
export class LoginService {
    constructor(
        @InjectRepository(Login)
        private readonly loginRepo: Repository<Login>,
    ) { }

    async findByUsername(username: string): Promise<Login|undefined> {        
        return await this.loginRepo.findOne({
            where: {
                username: username
            },
            relations: ["user"]
        })
    }

    async isValid(username:string, password:string): Promise<Login|undefined> {
        const login = await this.findByUsername(username);
        if( !login ) {
            return undefined;
        }
        const valid = await argon2.verify(login.password, password);
        if( !valid ) {
            return undefined;
        }
        return login;
    }
}