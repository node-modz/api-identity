import winston from 'winston'
import jsonStringify from 'fast-safe-stringify'

// based on: 
//  https://github.com/winstonjs/winston/issues/1334
//  https://levelup.gitconnected.com/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-1c31c1ab9342

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info: any) => {
            return `${info.timestamp} ${info.level}: [${info.label}] ${info.message}`
        },
    ),
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
]

const logger = winston.createLogger({
    level: level(),
    levels,
    //format:winston.format.json(),
    format: format,
    transports,
});

const Logger = (mod: NodeModule) => new Proxy(logger, {
    get(target, propKey) {
        const parts = mod.filename.split('/');
        const fileName = parts[parts.length - 2] + '/' + parts.pop()
        return (...args: any) => {
            const msg = args.map(jsonStringify).join(' ');
            target.log({ label: fileName, group: null, message: msg, level: String(propKey) })
        }
    }
});


export default Logger