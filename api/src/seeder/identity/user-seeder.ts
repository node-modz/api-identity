import { User, Post, Tenant } from "../../entities/identity/index";
import { createConnection, Db, getConnection, QueryRunner } from "typeorm";
import { Seeder } from "../seeder";
import argon2 from "argon2";
import * as path from 'path'
import * as process from 'process'


type UserData = {
    email: string, firstName: string, lastName: string, password: string,
    posts: [
        { title: string, text: string },
    ]
}

export class IdentityUserSeeder implements Seeder {
    async setup(file: string): Promise<void> {
        
        if (!file.endsWith(".ts")) {
            throw new Error(`unknown file type, expecting .ts file: ${file}`);
        }

        console.log(process.cwd())
        console.log(__dirname)
        const data = require(process.cwd()+"/"+file.replace(/\.[^/.]+$/, "")).default as UserData[];

        console.log(data);
        //if( true ) return;
        for (var u of data) {
            let user = await User.findOne({
                where: {
                    email: u.email,
                },
            });
            if (!user) {
                const hashedPWD = await argon2.hash(u.password);

                const result = await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User)
                    .values({
                        username: u.email,
                        email: u.email,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        password: hashedPWD,
                    })
                    .execute();
                user = result.raw[0];
            }
            if (u.posts != undefined) {
                for (var p of u.posts) {
                    const post = await Post.findOne({
                        where: {
                            title: p.title,
                        },
                    });
                    if (!post) {
                        Post.create({ creator: user, ...p }).save();
                    }
                }
            }
        }

    }
    async tearDown(): Promise<void> {
        const qb = getConnection().createQueryBuilder()
        await qb.delete().from(Post).execute();
        await qb.delete().from(User).execute();        
        await qb.delete().from(Tenant).execute();
    }

}