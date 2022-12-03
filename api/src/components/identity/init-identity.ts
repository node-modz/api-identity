import { json, urlencoded } from "body-parser";
import * as fs from 'fs';
import * as jose from 'node-jose';
import Container from "typedi";
import Logger from '../../lib/logger/Logger';
import { AppContext } from "../../lib/core/AppContext";
import * as oauth2Routes from './routes/oauth2-routes'
import * as identityRoutes from './routes/identity-routes'
import { IdentityConfigOptions } from "./config/IdentityConfigOptions";

const logger = Logger(module);

const init = async (ctx: AppContext) => {

  const config: IdentityConfigOptions = Container.get('IdentityConfigOptions');

  logger.info(ctx.name, ": init identity: ");
  logger.info(ctx.name, ": init oauth jwt_secret:", config.oauth2.jwt_secret);

  const keyStore = await initKeyStore(ctx,config);

  const app = ctx.http;
  
  app.use('/', identityRoutes.initRoutes() );
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(oauth2Routes.initRoutes("/oauth2", keyStore));

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
