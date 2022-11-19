
export const __prod__ = process.env.NODE_ENV === 'production'

export const __SERVER_CONFIG__ = {
    // this host.
    // TODO: this can support multiple hosts.
    host: "http://localhost:4000",

    db : {
        url : process.env.DB_URL
    },
    notifier: {
        email: {
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            user: "cejfsdvkagb6ktmb@ethereal.email",
            password: "cpTDqQpQ8WGDttRs2z",
        }
    },
    identity: {
        session_store: process.env.IDENTITY_SESSION_STORE as string,
        session_secret: process.env.IDENTITY_SESSION_SECRET as string,
        cookie_name: process.env.IDENTITY_COOKIE_NAME as string,
        cookie_max_age: process.env.IDENTITY_COOKIE_MAX_AGE
            ? eval(process.env.IDENTITY_COOKIE_MAX_AGE) as number
            : 1000 * 60 * 60 * 24 * 7,
        cors_allow_domains: process.env.IDENTITY_CORS_ALLOW_DOMAINS?.split(",") as string[],
        forgot_password_prefix: 'forgot-password:',
        oauth2: {
            jwt_keys: process.env.IDENTITY_OAUTH2_JWT_KEYS || 'keys.json',
            jwt_secret: process.env.IDENTITY_OAUTH2_JWT_SECRET as string
        },
        federated: {
            google: {
                type: 'google',
                client_id: process.env.GOOGLE_CLIENT_ID as string,
                client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
                scopes: ['email', 'profile']
            },
            github: {
                type: 'github',
                client_id: process.env.GITHUB_CLIENT_ID as string,
                client_secret: process.env.GITHUB_CLIENT_SECRET as string,
                scopes: ['user:email']
            },
            w3l: {
                type: 'w3l',
                client_id: process.env.W3L_CLIENT_ID as string,
                client_secret: process.env.W3L_CLIENT_SECRET as string,
                scopes: ['identity:profile', 'accounting:*']
            }
        } as Record<string, {
            type: string,
            client_id: string,
            client_secret: string
            authorize_url?: string
            token_url?: string
            profile_url?: string
            callback_url?: string,
            scopes: string[]
        }>
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