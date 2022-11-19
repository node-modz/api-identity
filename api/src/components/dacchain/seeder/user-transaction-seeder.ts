import { getConnection } from "typeorm";
import {
    Payment, W3LedgerAccountActivity
} from "../../dacchain/entities/index";
import { W3ChainService } from "../services/W3ChainService";
import { Inject, Service } from 'typedi';
import Logger from "../../../lib/Logger";
import { Seeder } from "../../../lib/seeder/Seeder";

const logger = Logger(module)

type Transaction = {
    from: string, to: string,
    ledgerRefId: string,
    txnType: string,
    txnRefId: string,
    txnDate?: Date,
    payment: Payment
}

@Service()
export class UserTransactionSeeder implements Seeder {

    @Inject()
    private chainService: W3ChainService

    async setup(file: string): Promise<void> {
                
        if (!file.endsWith(".ts")) {
            throw new Error(`unknown file type, expecting .ts file: ${file}`);
        }
        
        const data = require(process.cwd()+"/"+file.replace(/\.[^/.]+$/, "")).default as Transaction[]
        for (const txn of data) {
            /**
             * find the two chains
             */
            const fromChain = await this.chainService.findChainByEmail(txn.from);
            const toChain = await this.chainService.findChainByEmail(txn.to);
            if (fromChain === undefined || toChain === undefined) {
                logger.info("error chain not found were they created earlier:", { fromChain, toChain })
            } else {
                /**
                 * create NetworkLedgers
                 */
                let ledger = await this.chainService.findLedger(fromChain, toChain.chaninId, txn.ledgerRefId)
                if (ledger === undefined) {
                    logger.info("ledger not found between: ", { from: txn.from, to: txn.to })
                    ledger = await this.chainService.createNetworkLedger(fromChain, toChain.chaninId, txn.ledgerRefId)
                }
                const activity = await this.chainService.findActivityByTxnRef(ledger, txn.txnRefId);
                if (activity.length <= 0) {
                    /**
                     * no activity lets create one.
                     */
                    await this.chainService.applyPayment(ledger, txn.txnType, txn.payment, txn.txnRefId, txn.txnDate)
                }
            }
        }
    }

    async tearDown(): Promise<void> {
        await getConnection().createQueryBuilder().delete().from(W3LedgerAccountActivity).execute();        
    }
}