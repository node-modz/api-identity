import { Seeder } from "../seeder";
import { Tenant, User, } from "../../entities/identity/index";
import {
  Payment,
  W3Chain,
  W3Ledger,
  W3LedgerAccount,
  W3LedgerAccountActivity,
  __LEDGER_RULES__
} from "../../entities/dacchain/index";
import { createConnection, Db, getConnection, QueryRunner } from "typeorm";
import { W3ChainService } from "../../services/dacchain/W3ChainService";

type UserTenant = { username: string, tenantName: string };

export class UserChainSeeder implements Seeder {

    async setup(file: string): Promise<void> {

        const userRepo = getConnection().getRepository(User)
        const chainService = new W3ChainService()

        const data = require(process.cwd()+"/"+file.replace(/\.[^/.]+$/, "")).default as UserTenant[]
        for (var ut of data) {
            const tenant = await Tenant.findOne({ where: { name: ut.tenantName } })
            const user = await User.findOne({
              where: { username: ut.username },
              relations: ["tenant"]
            })
        
            if( user!=undefined){
              if (tenant != null && !user?.tenant) {
                console.log("associating user: ", user.email, " with: ", tenant.name)
          
                user.tenant = tenant
                await userRepo.save(user)
              }
              /**
               * creat a chain for user
               */
              let chain = await chainService.findChainByUser(user)
        
              if (chain == undefined) {
                console.log("  creating chain: ", user.username);
                chain = await chainService.createNewChain(user)
              }
        
              let walletLedger = await chainService.findWalletLedger(chain)
        
              if (walletLedger == undefined) {
                /**
                 * create wallets
                 */
                await chainService.createWalletLedger(chain!)
              }
            }
            
          }
    }
    async tearDown(): Promise<void> {
      await getConnection().createQueryBuilder().delete().from(W3LedgerAccount).execute();
      await getConnection().createQueryBuilder().delete().from(W3Ledger).execute();
      await getConnection().createQueryBuilder().delete().from(W3Chain).execute();
    }
}