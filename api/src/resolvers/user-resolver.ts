import { User } from "../entities/user";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { RequestContext } from "../app/request-context";
import { __COOKIE_NAME__ } from "../app/app-constants";
import 'reflect-metadata'

@InputType()
class RegisterUserInput {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;

  validate(): FieldError[] | null {
    const errors: FieldError[] = []
    if (!this.email.includes("@")) {
      errors.push(new FieldError("email", "invalid email"));
    }

    if (this.username.length <= 2) {
      errors.push(new FieldError("username", "length must be greater than 2"));
    }

    if (this.username.includes("@")) {
      errors.push(new FieldError("username", "cannot include an @"));
    }

    if (this.password.length <= 2) {
      errors.push(new FieldError("password", "length must be greater than 2"));
    }
    return errors.length > 0 ? errors : null;
  }
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
  constructor(field: string, message: string) {
    this.field = field;
    this.message = message;
  }
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: RequestContext) {
    
    const userId = req.session.userId;  
    if (!userId) {
      console.log("session no active session:");
      return null;
    }
    
    console.log("session user found: ",userId);
    const user = await User.findOne({ where: { id: userId } });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("userinfo") userinfo: RegisterUserInput,
    @Ctx() { req }: RequestContext
  ): Promise<UserResponse> {
    console.log("reegister request");
    const errors = userinfo.validate();
    if (errors) {
      return { errors };
    }
    const hashedPWD = await argon2.hash(userinfo.password);
    let user;
    try {
      console.log("registering user: ", userinfo.username, "password:", userinfo.password)
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: userinfo.username,
          email: userinfo.email,
          password: hashedPWD,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
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
    req.session!.userId = user.id;
    console.log("session save:", req.session);
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: RequestContext
  ): Promise<UserResponse> {
    console.log("login user: ", username, "password:", password)
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
    req.session!.userId = user.id;
    console.log("session save:", req.session);
    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx(){req, res}: RequestContext): Promise<Boolean> {
    res.clearCookie(__COOKIE_NAME__)
    return new Promise<Boolean>(res=>{
      req.session.destroy(err=>{
        if(err) {
          console.log("unable to destroy session",err)
          res(false)
          return
        }
        res(true)
      })
    })
  }
}
