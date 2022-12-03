import argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { Inject, Service } from 'typedi';
import { Repository } from "typeorm";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IdentityConfigOptions } from "../../config/IdentityConfigOptions";
import Logger from "../../../../lib/core/logger/Logger";
import { Login, User } from '../../entities/identity';
import { Token } from "../../resolvers/models";

const logger = Logger(module)

@Service()
export class AuthService {

  @Inject('IdentityConfigOptions')
  private readonly identityConfig: IdentityConfigOptions

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Login)
    private readonly loginRepo: Repository<Login>
  ) { }

  async createLogin(userinfo: {
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar?: string,
  }): Promise<User> {
    const hashedPWD = await argon2.hash(userinfo.password);
    logger.info(
      "registering user: ",
      userinfo.username,
      "password:",
      userinfo.password
    );
    let user = await User.create({
      lastName: userinfo.lastName,
      firstName: userinfo.firstName,
      email: userinfo.email,
      avatar: userinfo.avatar ? userinfo.avatar : "",
    }).save();

    let login = await Login.create({
      username: userinfo.username,
      password: hashedPWD,
      user: user,
    }).save();

    return user
  }

  createToken(user: User): Token {
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        avatar: user.avatar,
        role: user.email.startsWith("vn1") ? "admin" : "user",
        iss: "api.ledgers",
        aud: "api.ledgers",
      },
      this.identityConfig.oauth2.jwt_secret,
      { algorithm: "HS256", expiresIn: "1h" }
    );
    const decodedToken = jwtDecode<{ sub: string; exp: number }>(token);
    const userInfo = (({ firstName, lastName, avatar }) => ({ firstName, lastName, avatar }))(
      user
    );

    const t = new Token()
    t.token = token;
    t.userInfo = JSON.stringify(userInfo)
    t.expiresAt = decodedToken.exp
    return t;
  };
}