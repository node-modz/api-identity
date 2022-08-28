
export const __prod__ = process.env.NODE_ENV === 'production'
export const __COOKIE_NAME__ = "qid";
export const __COOKIE_MAX_AGE__ = 1000 * 60 * 60 * 24 * 180; // 180days
export const __FORGET_PASSWORD_PREFIX__ = "forget-password:";
export const __CORS_ALLOW_DOMAINS__ = "http://localhost:3000"
export const __SESSION_SECRET__ = "adfadadf-afadfad-afdafa"
export const __LEDGERS_DB__ = "postgresql://docker:docker@localhost:5433/ledgers" //process.env.DATABASE_URL,
export const __REDIS_SERVER__ = "localhost:6389"
export const __JWT_SECRET__ = "some-xyz-seccret"


export const __CONFIG__ = {
    email: {
        auth: {
            host:"smtp.ethereal.email",
            port:587,
            secure:false, // true for 465, false for other ports
            user: "cejfsdvkagb6ktmb@ethereal.email",
            password: "cpTDqQpQ8WGDttRs2z",
        }
    },
    auth : {
        forgot_password_prefix:'forgot-password:'
    }
}

// {
//     user: 'cejfsdvkagb6ktmb@ethereal.email',
//     pass: 'cpTDqQpQ8WGDttRs2z',
//     smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
//     imap: { host: 'imap.ethereal.email', port: 993, secure: true },
//     pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
//     web: 'https://ethereal.email'
// }