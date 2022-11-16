
export const __prod__ = process.env.NODE_ENV === 'production'
export const __COOKIE_NAME__ = "qid";
export const __COOKIE_MAX_AGE__ = 1000 * 60 * 60 * 24 * 180; // 180days
export const __FORGET_PASSWORD_PREFIX__ = "forget-password:";
export const __CORS_ALLOW_DOMAINS__ = "http://localhost:3000"
export const __SESSION_SECRET__ = "adfadadf-afadfad-afdafa"
export const __LEDGERS_DB__ = "postgresql://docker:docker@localhost:5433/ledgers" //process.env.DATABASE_URL,
export const __REDIS_SERVER__ = "localhost:6389"
export const __JWT_SECRET__ = "some-xyz-seccret"


export const __SERVER_CONFIG__ = {
    // this host.
    // TODO: this can support multiple hosts.
    host: "http://localhost:4000", 
    // application host for redirect post login.
    // TODO: we should get this from redirect_uri on initial login request.
    appHost: "http://localhost:3000", 
    notifier: {
        email: {
            host:"smtp.ethereal.email",
            port:587,
            secure:false, // true for 465, false for other ports
            user: "cejfsdvkagb6ktmb@ethereal.email",
            password: "cpTDqQpQ8WGDttRs2z",
        }
    },
    identity : {
        forgot_password_prefix:'forgot-password:',
        oauth2 : {
            jwks_file: 'keys.json'
        },        
        social: {
            google:{
                type: 'google',
                client_id: process.env.GOOGLE_CLIENT_ID as string,
                client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
                scopes:['email', 'profile']
            },
            github: {
                type: 'github',
                client_id: process.env.GITHUB_CLIENT_ID as string,
                client_secret: process.env.GITHUB_CLIENT_SECRET as string,
                scopes:['user:email']
            },
            w3l: {
                type: 'w3l',
                client_id: process.env.W3L_CLIENT_ID as string,
                client_secret: process.env.W3L_CLIENT_SECRET as string,
                scopes:['identity:profile', 'accounting:*']
            }
        } as Record<string,{
            type:string,
            client_id:string,
            client_secret:string
            authorize_url?:string
            token_url?:string
            profile_url?:string
            callback_url?:string,
            scopes:string[]
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