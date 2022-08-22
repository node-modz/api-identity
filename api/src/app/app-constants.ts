
export const __prod__ = process.env.NODE_ENV === 'production'
export const __COOKIE_NAME__ = "qid";
export const __COOKIE_MAX_AGE__ = 1000 * 60 * 60 * 24 * 180; // 180days
export const __FORGET_PASSWORD_PREFIX__ = "forget-password:";
export const __CORS_ALLOW_DOMAINS__ = "http://localhost:3000"
export const __SESSION_SECRET__ = "adfadadf-afadfad-afdafa"
export const __LEDGERS_DB__ = "postgresql://docker:docker@localhost:5433/ledgers" //process.env.DATABASE_URL,
export const __REDIS_SERVER__ = "localhost:6389"
export const __JWT_SECRET__ = "some-xyz-seccret"