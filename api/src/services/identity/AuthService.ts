import { RegisterUserInput, Token } from "src/resolvers/models";
import argon2 from "argon2";
import { getConnection } from "typeorm";
import { User } from "../../entities/core/User";
import {
    __CONFIG__,
    __COOKIE_NAME__,
    __JWT_SECRET__,
} from "../../app/app-constants";
import jwtDecode from "jwt-decode";
import * as jwt from "jsonwebtoken";

export class AuthService {
    async createLogin(userinfo: RegisterUserInput): Promise<User> {
        const hashedPWD = await argon2.hash(userinfo.password);
        console.log(
            "registering user: ",
            userinfo.username,
            "password:",
            userinfo.password
          );
        const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                lastName: userinfo.lastName,
                firstName: userinfo.firstName,
                username: userinfo.username,
                email: userinfo.email,
                password: hashedPWD,
            })
            .returning("*")
            .execute();
        let user = result.raw[0];
        return user
    }
    createToken(user: User): Token {
        const token = jwt.sign(
          {
            sub: user.id,
            email: user.email,
            role: user.email.startsWith("vn1") ? "admin" : "user",
            iss: "api.ledgers",
            aud: "api.ledgers",
          },
          __JWT_SECRET__,
          { algorithm: "HS256", expiresIn: "1h" }
        );
        const decodedToken = jwtDecode<{ sub: string; exp: number }>(token);
        const userInfo = (({ firstName, lastName }) => ({ firstName, lastName }))(
          user
        );
      
        const t = new  Token()
        t.token=token;
        t.userInfo=JSON.stringify(userInfo)
        t.expiresAt=decodedToken.exp
        return t;
      };
}