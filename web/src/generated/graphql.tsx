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

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'ChangePasswordResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null, tokenInfo?: { __typename?: 'Token', token: string, userInfo: string, expiresAt: number } | null } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'ForgotPasswordResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null, tokenInfo?: { __typename?: 'Token', token: string, userInfo: string, expiresAt: number } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string, firstName: string, lastName: string } | null, tokenInfo?: { __typename?: 'Token', token: string, userInfo: string, expiresAt: number } | null } };

export type BankActivityQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type BankActivityQuery = { __typename?: 'Query', bankActivity: { __typename?: 'PaginatedBankActivity', hasMore: boolean, activity: Array<{ __typename?: 'BankActivity', id: string, activityDate: any, activityType: string, amount: number, reference?: string | null, description?: string | null, createdAt: any }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: string, username: string } | null, tokenInfo?: { __typename?: 'Token', token: string, userInfo: string, expiresAt: number } | null } | null };

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: string, title: string, text: string, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string } }> };


export const ChangePasswordDocument = gql`
    mutation changePassword($token: String!, $password: String!) {
  changePassword(input: {token: $token, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
    tokenInfo {
      token
      userInfo
      expiresAt
    }
  }
}
    `;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    errors {
      field
      message
    }
  }
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
    tokenInfo {
      token
      userInfo
      expiresAt
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $username: String!, $password: String!, $firstName: String!, $lastName: String!) {
  register(
    userinfo: {username: $username, email: $email, password: $password, firstName: $firstName, lastName: $lastName}
  ) {
    errors {
      field
      message
    }
    user {
      id
      username
      firstName
      lastName
    }
    tokenInfo {
      token
      userInfo
      expiresAt
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
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
export const MeDocument = gql`
    query Me {
  me {
    user {
      id
      username
    }
    tokenInfo {
      token
      userInfo
      expiresAt
    }
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const PostsDocument = gql`
    query Posts {
  posts {
    id
    title
    text
    createdAt
    updatedAt
    creator {
      id
    }
  }
}
    `;

export function usePostsQuery(options?: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostsQuery, PostsQueryVariables>({ query: PostsDocument, ...options });
};