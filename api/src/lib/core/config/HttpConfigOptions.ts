
export type HttpConfigOptions = {
  cors_allow_domains?: string[];
  views?: string;
  session: {
    redis_store: string;
    cookie_secret: string;
    cookie_name: string;
    cookie_max_age: number;
  };
};
