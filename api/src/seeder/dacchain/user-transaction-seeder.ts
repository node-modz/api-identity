import {
    Payment,
    W3Chain,
    W3Ledger,
    W3LedgerAccount,
    W3LedgerAccountActivity,
    __LEDGER_RULES__
} from "../../entities/dacchain/index";
import { W3ChainService } from "../../services/dacchain/W3ChainService";
import { createConnection, Db, getConnection, QueryRunner } from "typeorm";
import { Seeder } from "../seeder";

type Transaction = {
    from: string, to: string,
    ledgerRefId: string,
    txnType: string,
    txnRefId: string,
    txnDate?: Date,
    payment: Payment
}

export class UserTransactionSeeder implements Seeder {
    async setup(file: string): Promise<void> {
        
        const chainService = new W3ChainService()

        if (!file.endsWith(".ts")) {
            throw new Error(`unknown file type, expecting .ts file: ${file}`);
        }
        
        const data = require(process.cwd()+"/"+file.replace(/\.[^/.]+$/, "")).default as Transaction[]
        for (const txn of data) {
            /**
             * find the two chains
             */
            const fromChain = await chainService.findChainByEmail(txn.from);
            const toChain = await chainService.findChainByEmail(txn.to);
            if (fromChain === undefined || toChain === undefined) {
                console.log("error chain not found were they created earlier:", { fromChain, toChain })
            } else {
                /**
                 * create NetworkLedgers
                 */
                let ledger = await chainService.findLedger(fromChain, toChain.chaninId, txn.ledgerRefId)
                if (ledger === undefined) {
                    console.log("ledger not found between: ", { from: txn.from, to: txn.to })
                    ledger = await chainService.createNetworkLedger(fromChain, toChain.chaninId, txn.ledgerRefId)
                }
                const activity = await chainService.findActivityByTxnRef(ledger, txn.txnRefId);
                if (activity.length <= 0) {
                    /**
                     * no activity lets create one.
                     */
                    await chainService.applyPayment(ledger, txn.txnType, txn.payment, txn.txnRefId, txn.txnDate)
                }
            }
        }
    }

    async tearDown(): Promise<void> {
        await getConnection().createQueryBuilder().delete().from(W3LedgerAccountActivity).execute();        
    }
}