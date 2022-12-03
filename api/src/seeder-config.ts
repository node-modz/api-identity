import dotenv from 'dotenv-safe';
import * as serverConfig from './api-config'


dotenv.config();

export const __prod__ = process.env.NODE_ENV === 'production'
export const __SERVER_CONFIG__ = {
    config : [        
        {prop:'db',container_ref:'DBConfigOptions'},   
        {prop:'identity',container_ref:'IdentityConfigOptions'},     
    ],
    setup: [
        { init: "dist/lib/core/init-db"  },        
    ],

    server: serverConfig.__SERVER_CONFIG__.server,
    http: serverConfig.__SERVER_CONFIG__.http,
    db: serverConfig.__SERVER_CONFIG__.db,
    apollo:serverConfig.__SERVER_CONFIG__.apollo,
    notifier:serverConfig.__SERVER_CONFIG__.notifier,
    identity:serverConfig.__SERVER_CONFIG__.identity
    
}