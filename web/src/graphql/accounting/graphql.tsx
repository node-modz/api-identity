import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Timestamp: any;
};

export type BankActivity = {
  __typename?: 'BankActivity';
  activityDate: Scalars['DateTime'];
  activityType: Scalars['String'];
  amount: Scalars['Float'];
  createdAt: Scalars['Timestamp'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  reference?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Timestamp'];
};

export type ChangePasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  errors?: Maybe<Array<FieldError>>;
  tokenInfo?: Maybe<Token>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type ForgotPasswordResponse = {
  __typename?: 'ForgotPasswordResponse';
  errors?: Maybe<Array<FieldError>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: ChangePasswordResponse;
  createPost: Post;
  forgotPassword: ForgotPasswordResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCreatePostArgs = {
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  userinfo: RegisterUserInput;
};

export type PaginatedBankActivity = {
  __typename?: 'PaginatedBankActivity';
  activity: Array<BankActivity>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  creator: User;
  id: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  bankActivity: PaginatedBankActivity;
  hello: Scalars['String'];
  me?: Maybe<UserResponse>;
  post?: Maybe<Post>;
  posts: Array<Post>;
};


export type QueryBankActivityArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['String'];
};

export type RegisterUserInput = {
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Token = {
  __typename?: 'Token';
  expiresAt: Scalars['Float'];
  token: Scalars['String'];
  userInfo: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  posts: Array<Post>;
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  tokenInfo?: Maybe<Token>;
  user?: Maybe<User>;
};

export type BankActivityQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type BankActivityQuery = { __typename?: 'Query', bankActivity: { __typename?: 'PaginatedBankActivity', hasMore: boolean, activity: Array<{ __typename?: 'BankActivity', id: string, activityDate: any, activityType: string, amount: number, reference?: string | null, description?: string | null, createdAt: any }> } };


export const BankActivityDocument = gql`
    query BankActivity($offset: Int!, $limit: Int!) {
  bankActivity(offset: $offset, limit: $limit) {
    activity {
      id
      activityDate
      activityType
      amount
      reference
      description
      createdAt
    }
    hasMore
  }
}
    `;

export function useBankActivityQuery(options: Omit<Urql.UseQueryArgs<BankActivityQueryVariables>, 'query'>) {
  return Urql.useQuery<BankActivityQuery, BankActivityQueryVariables>({ query: BankActivityDocument, ...options });
};