import { User } from "../entities/identity/User";
import { FieldError } from '../../../lib/graphql/FieldError'
import {
  Field,
  InputType,  
  ObjectType,  
} from "type-graphql";
import "reflect-metadata";

@InputType()
export class RegisterUserInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  firstName!: string;

  @Field({ nullable: true })
  lastName!: string;

  validate(): FieldError[] | null {
    const errors: FieldError[] = [];

    if (!this.username.includes("@")) {
      errors.push(new FieldError("username", "username/email is invalid"));
    }
    if (!this.email) {
      this.email = this.username
    }

    if (this.password.length <= 2) {
      errors.push(new FieldError("password", "length must be greater than 2"));
    }

    if (!this.firstName) {
      errors.push(new FieldError("firstName", "invalid first name"));
    }

    if (!this.lastName) {
      errors.push(new FieldError("lastName", "invalid last name"));
    }
    return errors.length > 0 ? errors : null;
  }
}



@ObjectType()
export class Token {
  @Field()
  token: string;
  @Field()
  userInfo: string;
  @Field()
  expiresAt: number;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Token, { nullable: true })
  tokenInfo?: Token;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?:FieldError[]
}
@ObjectType()
export class ChangePasswordResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Token, { nullable: true })
  tokenInfo?: Token;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;

  validate(): FieldError[] | null {
    const errors: FieldError[] = [];

    if (this.password.length <= 2) {
      errors.push(new FieldError("password", "length must be greater than 2"));
    }

    return errors.length > 0 ? errors : null;
  }
}

