import { json, urlencoded } from "body-parser";
import * as fs from 'fs';
import * as jose from 'node-jose';
import Logger from '../lib/Logger';
import { AppContext } from "./init-context";

const logger = Logger(module);

export type IdentityConfigOptions = {
  forgot_password_prefix: string,
  oauth2: {
    jwt_keys: string
    jwt_secret: string
  }
  federated: Record<string, {
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

const init = async (ctx: AppContext, config: IdentityConfigOptions) => {
  logger.info(ctx.name, ": init identity: ");

  logger.info(ctx.name, ": init oauth jwt_secret:", config.oauth2.jwt_secret);
  const keyStore = await initKeyStore(ctx,config);

  const app = ctx.http;

  const identityRoutes = require('../components/identity/routes/identity-routes')
  app.use('/', identityRoutes);

  app.use(json());
  app.use(urlencoded({ extended: false }));

  const oauthRoutes = require('../components/identity/routes/oauth2-routes')
  app.use(oauthRoutes("/oauth2", keyStore));

  logger.info(ctx.name, ": init identity: done")
};

const initKeyStore = async (appCtxt: AppContext, config: IdentityConfigOptions): Promise<jose.JWK.KeyStore> => {

  const keyfile = config.oauth2.jwt_keys;
  let keyStore: jose.JWK.KeyStore;
  if (!fs.existsSync(keyfile)) {
    keyStore = jose.JWK.createKeyStore()
    await keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' })
    fs.writeFileSync(
      keyfile,
      JSON.stringify(keyStore.toJSON(true), null, '  ')
    )
  } else {
    const ks = fs.readFileSync(keyfile)
    keyStore = await jose.JWK.asKeyStore(ks.toString());
  }
  // const key = keyStore.all({ use: 'sig' })[0]
  // console.log(key.toPEM());
  // console.log(key.toPEM(true));
  logger.info(appCtxt.name, ": init oauth: jwks #keys=", keyStore.all().length);

  return keyStore;
}
export { init as initIdentity };
export default init;
