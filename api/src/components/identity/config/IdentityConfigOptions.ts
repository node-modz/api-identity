
export type IdentityConfigOptions = {
  forgot_password_prefix: string;
  oauth2: {
    jwt_keys: string;
    jwt_secret: string;
  };
  federated: Record<string, {
    type: string;
    client_id: string;
    client_secret: string;
    authorize_url?: string;
    token_url?: string;
    profile_url?: string;
    callback_url?: string;
    scopes: string[];
  }>;
};
