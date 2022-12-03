import argon2 from "argon2";
import "reflect-metadata";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Inject, Service } from "typedi";
import { v4 } from "uuid";
import { isUserAuth } from "../../../lib/core/graphql/Auth";
import { FieldError } from '../../../lib/core/graphql/FieldError';
import { GraphQLReqContext } from "../../../lib/core/graphql/GraphQLReqContext";
import { EmailNotifierService } from "../../notifier/services/EmailNotifierService";
import { Login, User } from "../entities/identity";
import { AuthService } from "../services/identity/AuthService";
import {
  ChangePasswordInput, ChangePasswordResponse, ForgotPasswordResponse, RegisterUserInput, UserResponse
} from "./models";

import { IdentityConfigOptions } from "../config/IdentityConfigOptions";
import Logger from "../../../lib/core/logger/Logger";
import { LoginService } from "../services/identity/LoginService";
import { SecurityService } from "../services/identity/SecurityService";
import { UserService } from "../services/identity/UserService";

const logger = Logger(module)

@Service()
@Resolver()
export class AuthResolver {
  
  @Inject('IdentityConfigOptions')
  private readonly identityConfig: IdentityConfigOptions


  constructor(
    private readonly authService: AuthService,
    private readonly notifierService: EmailNotifierService,
    private readonly userService: UserService,
    private readonly loginService: LoginService,
    private readonly securityService: SecurityService) { }

  @Mutation(() => ForgotPasswordResponse)
  @UseMiddleware([])
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() reqCtxt: GraphQLReqContext
  ): Promise<ForgotPasswordResponse> {
    logger.info("begin forgot password");
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return {
        errors: [new FieldError("email", "invalid email")],
      };
    }

    const token = v4();
    await reqCtxt.redis.set(
      this.identityConfig.forgot_password_prefix + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3 // 3days
    );

    await this.notifierService.notify(
      email,
      `<a href="http://localhost:3000/identity/password/${token}">reset password</a>`
    );

    return { errors: [] };
  }

  @Mutation(() => ChangePasswordResponse)
  @UseMiddleware([])
  async changePassword(
    @Arg("input") input: ChangePasswordInput,
    @Ctx() reqCtxt: GraphQLReqContext
  ) {
    const { token, password } = input;
    const { req, res, redis } = reqCtxt;
        
    if (password.length <= 2) {
      return {
        errors: [new FieldError("password", "length must be greater than 2")],
      };
    }

    let key = this.identityConfig.forgot_password_prefix + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [new FieldError("token", "invalid token")],
      };
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return {
        errors: [new FieldError("token", "user no longer exists")],
      };
    }

    // TODO: use user.LoginId
    await Login.update(
      { user: { id: user.id } },
      {
        password: await argon2.hash(password),
      }
    );

    await redis.del(key);

    // log in user after change password
    this.securityService.createUserSession(req, res, user);

    const tokenInfo = this.authService.createToken(user);
    return { user, tokenInfo };
  }

  @Query(() => UserResponse, { nullable: true })
  async me(@Ctx() { req }: GraphQLReqContext) {
    
    const userId = req.session.userId;
    if (!userId) {
      logger.info("session no active session:");
      return null;
    }

    logger.debug("session user found: ", userId);
    const user = await User.findOne({ where: { id: userId } });

    if (user) {
      const tokenInfo = this.authService.createToken(user);
      return { user, tokenInfo };
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("userinfo") userinfo: RegisterUserInput,
    @Ctx() { req, res }: GraphQLReqContext
  ): Promise<UserResponse> {

    const errors = userinfo.validate();
    if (errors) {
      return { errors };
    }

    let user, tokenInfo;
    try {
      logger.debug(
        "registering user: ",
        userinfo.username,
        "password:",
        userinfo.password
      );

      user = await this.authService.createLogin(userinfo)
      tokenInfo = this.authService.createToken(user);

      logger.debug("token: ", tokenInfo);
    } catch (err) {
      let error = err as { code: string; message: string };
      logger.error(
        "unable to save user:code=",
        error.code,
        ",message=",
        error.message
      );
      if (error.code === "23505") {
        return {
          errors: [new FieldError("username", "username already taken")],
        };
      } else {
        return {
          errors: [new FieldError("", error.message)],
        };
      }
    }
    logger.debug("tokenInfo:", tokenInfo);
    this.securityService.createUserSession(req, res, user);
    logger.debug("session save:", req.session);
    return { user, tokenInfo };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req, res }: GraphQLReqContext
  ): Promise<UserResponse> {
    logger.debug("login user: ", username, "password:", password);

    const user = await this.userService.findByCredentials(username, password);
    if (!user) {
      return {
        errors: [new FieldError("username", "invalid username/Password")],
      };
    }

    const tokenInfo = this.authService.createToken(user);
    this.securityService.createUserSession(req, res, user);

    logger.debug("tokenInfo:", tokenInfo);
    logger.debug("session save:", req.session);
    return { user, tokenInfo };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: GraphQLReqContext): Promise<Boolean> {
    return this.securityService.clearSession(req, res);
  }
}