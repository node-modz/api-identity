import { User } from "../entities/User";
import argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { RequestContext } from "../app/request-context";
import {
  __CONFIG__,
  __COOKIE_NAME__,
  __JWT_SECRET__,
} from "../app/app-constants";
import "reflect-metadata";
import {
  UserResponse,
  RegisterUserInput,
  FieldError,
  Token,
  ForgotPasswordResponse,
  ChangePasswordResponse,
  ChangePasswordInput,
} from "./models";
import { v4 } from "uuid";
import * as notifier from "../notify/email";

@Resolver()
export class UserResolver {
  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() reqCtxt: RequestContext
  ): Promise<ForgotPasswordResponse> {
    console.log("begin forgot password");
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return {
        errors: [new FieldError("email", "invalid email")],
      };
    }

    const token = v4();
    await reqCtxt.redis.set(
      __CONFIG__.auth.forgot_password_prefix + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3 // 3days
    );

    await notifier.sendEmail(
      email,
      `<a href="http://localhost:3000/identity/password/${token}">reset password</a>`
    );

    return { errors: [] };
  }

  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Arg("input") input: ChangePasswordInput,
    @Ctx() reqCtxt: RequestContext
  ) {
    const { token, password } = input;
    const { req, redis } = reqCtxt;

    if (password.length <= 2) {
      return {
        errors: [new FieldError("password", "length must be greater than 2")],
      };
    }

    let key = __CONFIG__.auth.forgot_password_prefix + token;
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

    await User.update(
      { id: userId },
      {
        password: await argon2.hash(password),
      }
    );

    await redis.del(key);

    // log in user after change password
    req.session.userId = user.id;

    const tokenInfo = createToken(user);
    return { user, tokenInfo };
  }

  @Query(() => UserResponse, { nullable: true })
  async me(@Ctx() { req }: RequestContext) {
    const userId = req.session.userId;
    if (!userId) {
      console.log("session no active session:");
      return null;
    }

    console.log("session user found: ", userId);
    const user = await User.findOne({ where: { id: userId } });

    if (user) {
      const tokenInfo = createToken(user);
      return { user, tokenInfo };
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("userinfo") userinfo: RegisterUserInput,
    @Ctx() { req }: RequestContext
  ): Promise<UserResponse> {
    const errors = userinfo.validate();
    if (errors) {
      return { errors };
    }
    const hashedPWD = await argon2.hash(userinfo.password);
    let user, tokenInfo;
    try {
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
      user = result.raw[0];

      tokenInfo = createToken(user);
      console.log("token: ", tokenInfo);
    } catch (err) {
      let error = err as { code: string; message: string };
      console.log(
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
    console.log("tokenInfo:", tokenInfo);
    req.session!.userId = user.id;
    console.log("session save:", req.session);
    return { user, tokenInfo };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: RequestContext
  ): Promise<UserResponse> {
    console.log("login user: ", username, "password:", password);
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return {
        errors: [new FieldError("username", "invalid Username/password")],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [new FieldError("username", "invalid username/Password")],
      };
    }
    const tokenInfo = createToken(user);
    req.session!.userId = user.id;

    console.log("tokenInfo:", tokenInfo);
    console.log("session save:", req.session);
    return { user, tokenInfo };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: RequestContext): Promise<Boolean> {
    const userId = req.session.userId;
    console.log("logging out user: ", userId);
    res.clearCookie(__COOKIE_NAME__);
    return new Promise<Boolean>((res) => {
      req.session.destroy((err) => {
        if (err) {
          console.log("unable to destroy session", err);
          res(false);
          return;
        }
        res(true);
      });
    });
  }
}

const createToken = (user: User): Token => {
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
