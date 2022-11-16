import { AppContext } from "./init-context";
import Logger from '../lib/Logger'

const logger = Logger(module);


const init = async (ctx: AppContext) => {
  logger.info(ctx.name,": init identity: ");
    
  const app = ctx.http;

  const identityRoutes = require('../routes/identity/identity-routes')
  app.use('/',identityRoutes);
  
  logger.info(ctx.name,": init identity: done")
};

export { init as initIdentity };
export default init;
