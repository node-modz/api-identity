
import dotenv from 'dotenv-safe';
import path from "path";
import { GraphqQLConfig } from "./lib/core/config/GraphqQLConfig";
import { DBConfigOptions } from "./lib/core/config/DBConfigOptions";
import { HttpConfigOptions } from "./lib/core/config/HttpConfigOptions";
import { IdentityConfigOptions } from "./components/identity/config/IdentityConfigOptions";
import { NotifierConfigOptions } from "./components/notifier/config/NotifierConfigOptions";
import { ServerConfigOptions } from "./lib/core/config/ServerConfigOptions";

dotenv.config();

export const __prod__ = process.env.NODE_ENV === 'production'
export const __SERVER_CONFIG__ = {
    config : [
        {prop:'server',container_ref:'ServerConfigOptions'},
        {prop:'db',container_ref:'DBConfigOptions'},
        {prop:'http',container_ref:'HttpConfigOptions'},
        {prop:'apollo',container_ref:'GraphQLConfigOptions'},
        {prop:'notifier',container_ref:'NotifierConfigOptions'},
        {prop:'identity',container_ref:'IdentityConfigOptions'},
    ],

    setup: [
        { init: "dist/lib/core/init-db"  },
        { init: "dist/lib/core/init-http"  },
        { init: "dist/lib/core/init-session"  },
        { init: "dist/lib/core/init-apollo"  },
        { init: "dist/components/identity/init-identity" },
    ],
    // this host.
    // TODO: this can support multiple hosts.
    server: {
        host: "http://localhost:4000",
        port: 4000,
    } as ServerConfigOptions,    
    http: {
        cors_allow_domains: process.env.HTTP_CORS_ALLOW_DOMAINS?.split(",") as string[],
        views: path.join(__dirname, 'views'),
        session: {
            redis_store: process.env.HTTP_SESSION_REDIS_STORE as string,
            cookie_secret: process.env.HTTP_SESSION_COOKIE_SECRET as string,
            cookie_name: process.env.HTTP_SESSION_COOKIE_NAME as string,
            cookie_max_age: process.env.HTTP_SESION_COOKIE_MAX_AGE
                ? eval(process.env.HTTP_SESSION_COOKIE_MAX_AGE as string) as number
                : 1000 * 60 * 60 * 24 * 7,
        }
    } as HttpConfigOptions,

    // db & orm config
    db: {
        type: "postgres",
        url: process.env.DB_URL as string,
        logging: false,
        entities: [
            path.join(__dirname, 'components/identity/entities/**/*.js'),
            path.join(__dirname, 'components/dacchain/entities/*'),
            path.join(__dirname, 'components/accounting/entities/*'),
            path.join(__dirname, 'entities/*')
        ],
        migrations: [
            path.join(__dirname, "migrations/*"),
            path.join(__dirname, "components/identity/migrations/*"),
            path.join(__dirname, "components/dacchain/migrations/*"),
            path.join(__dirname, "components/accounting/migrations/*"),
        ]
    } as DBConfigOptions,

    // resolvers
    apollo: {
        resolvers: [
            path.join(__dirname, "components/dacchain/resolvers/*.js"),
            path.join(__dirname, "components/identity/resolvers/*.js"),
            path.join(__dirname, "components/accounting/revolvers/*.js"),
        ]
    } as GraphqQLConfig,

    // notifier component config
    notifier: {
        email: {
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports            
            user:"c4f3ln36njgg4upe@ethereal.email",
            password:"fx8tR7V725vbbdwbZE"
        }
    } as NotifierConfigOptions,

    // identity component config
    identity: {
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
        }
    } as IdentityConfigOptions
}

// {
//     user: 'cejfsdvkagb6ktmb@ethereal.email',
//     pass: 'cpTDqQpQ8WGDttRs2z',
//     smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
//     imap: { host: 'imap.ethereal.email', port: 993, secure: true },
//     pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
//     web: 'https://ethereal.email'
// }