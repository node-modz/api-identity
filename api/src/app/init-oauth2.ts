import { AppContext } from "./init-context";
import { json, urlencoded } from "body-parser";
import * as fs from 'fs'
import * as jose from 'node-jose'
import { __SERVER_CONFIG__ } from "./app-constants";
import Logger from '../lib/Logger'

const logger = Logger(module);

const init = async (appCtxt: AppContext) => {
  logger.info(appCtxt.name, ": init oauth")
  logger.info(appCtxt.name, ": init oauth jwt_secret:", __SERVER_CONFIG__.identity.oauth2.jwt_secret);

  const app = appCtxt.http;

  const keyStore = await initKeyStore(appCtxt);

  app.use(json());
  app.use(urlencoded({ extended: false }));

  const oauthRoutes = require('../components/identity/routes/oauth2-routes')
  app.use(oauthRoutes("/oauth2",keyStore));

  logger.info(appCtxt.name, ": init oauth: done")
}

const initKeyStore = async (appCtxt: AppContext): Promise<jose.JWK.KeyStore> => {

  const keyfile = __SERVER_CONFIG__.identity.oauth2.jwt_keys;
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

export { init as initOAuth };
export default init;