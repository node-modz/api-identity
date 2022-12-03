import { getConnection } from "typeorm";
import {
  W3Chain,
  W3Ledger,
  W3LedgerAccount
} from "../entities/index";
import { Tenant, User } from "../../identity/entities/identity/index";
import { W3ChainService } from "../services/W3ChainService";
import { Service, Inject } from 'typedi';
import { AuthService } from "../../identity/services/identity/AuthService";
import { UserService } from "../../identity/services/identity/UserService";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from "typeorm";
import Logger from "../../../lib/logger/Logger";
import { Seeder } from "../../../lib/seeder/Seeder";

const logger = Logger(module)

type UserTenant = { username: string, tenantName: string };

@Service()
export class UserChainSeeder implements Seeder {

  @Inject()
  private authService: AuthService

  @Inject()
  private userService: UserService

  @Inject()
  private chainService: W3ChainService

  @InjectRepository(User)
  private userRepo: Repository<User>

  async setup(file: string): Promise<void> {


    const data = require(process.cwd() + "/" + file.replace(/\.[^/.]+$/, "")).default as UserTenant[]
    for (var ut of data) {
      const tenant = await Tenant.findOne({ where: { name: ut.tenantName } })
      const user = await this.userService.findByUsername(ut.username);

      if (user != undefined) {
        if (tenant != null && !user?.tenant) {
          logger.info("associating user: ", user.email, " with: ", tenant.name)

          user.tenant = tenant
          await this.userRepo.save(user)
        }
        /**
         * creat a chain for user
         */
        let chain = await this.chainService.findChainByUser(user)

        if (chain == undefined) {
          logger.info("  creating chain: ", user.email);
          chain = await this.chainService.createNewChain(user)
        }

        let walletLedger = await this.chainService.findWalletLedger(chain)

        if (walletLedger == undefined) {
          /**
           * create wallets
           */
          await this.chainService.createWalletLedger(chain!)
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