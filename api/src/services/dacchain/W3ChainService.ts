
import {
    W3Chain,
    W3Ledger,
    AccountType,
    W3LedgerAccount,
    W3LedgerAccountActivity,
    ActivityType,
    LedgerRules,
    Payment,
    __LEDGER_RULES__,
    LedgerType
} from "../../entities/dacchain/index";
import { getConnection } from "typeorm";
import { Md5 } from 'ts-md5'
import { User } from "../../entities/core/index";
import { randomUUID } from "crypto";


export class W3ChainService {

    async findChainByEmail(email: string): Promise<W3Chain | undefined> {
        const activityRepo = getConnection().getRepository(W3LedgerAccountActivity)
        const userRepo = getConnection().getRepository(User)
        const user = await userRepo.findOne({
            where: { username: email },
            relations: ["tenant"]
        })        
        if( user == undefined ) {
            return undefined
        }
        return this.findChainByUser(user)
    }

    async findChainByUser(user:User) : Promise<W3Chain|undefined> {
        return await W3Chain.findOne({
            where: {
                entityRefId: "tenant:" + user?.tenant?.id
            },
            relations: ["tenant"]
        })
    }

    async findLedger(owner: W3Chain, partnerChainId: string, ledgerEntityRefId: string): Promise<W3Ledger | undefined> {
        return await W3Ledger.findOne({
            where: {
                ownerChainId: owner.chaninId,
                partnerChainId: partnerChainId,
                entityRefId: ledgerEntityRefId
            },
            relations: ["tenant", "accounts"]
        })
    }

    async findActivityByTxnRef(ledger: W3Ledger, txnRefId: string): Promise<W3LedgerAccountActivity[]> {
        const activityRepo = getConnection().getRepository(W3LedgerAccountActivity)
        const ledgerId = ledger.id
        return activityRepo
            .createQueryBuilder('wlaa')
            .innerJoin(W3LedgerAccount, 'wla', 'wla.id = wlaa."ledgerAccountId"')
            .innerJoin(W3Ledger, 'wl', 'wl.id=wla."ledgerId"')
            .where('wlaa.txnRefId = :txnRefId', { txnRefId })
            .andWhere('wl.id = :ledgerId', { ledgerId })
            .getMany()
    }

    async createNewChain(user:User): Promise<W3Chain|undefined> {
        const chainRepo = getConnection().getRepository(W3Chain)
        if ( user.tenant == null || user.tenant === undefined ) {
            console.log("error: invalid tenant")
            return undefined
        }
        const chain = new W3Chain()
        chain.tenant = user.tenant!
        chain.chaninId = user.tenant.id
        chain.entityRefId = "tenant:" + user.tenant.id
        return await chainRepo.save(chain)
    }

    async createWalletLedger(owner: W3Chain): Promise<W3Ledger> {
        const ledgerRepo = getConnection().getRepository(W3Ledger)
        const acctRepo = getConnection().getRepository(W3LedgerAccount)
        const entityRefId = "wallet"
        /**
         * create W3Ledger
         */
        const ledger = new W3Ledger();
        ledger.tenant = owner.tenant;
        ledger.ledgerType = LedgerType.WALLET;
        ledger.ownerChainId = owner.chaninId;
        ledger.partnerChainId = owner.chaninId;
        ledger.entityRefId = entityRefId;
        ledger.ledgerId = "hash:" + owner.chaninId + ":" + owner.chaninId + ":" + entityRefId
        ledger.accounts = []
        ledger.ledgerHash = Md5.hashAsciiStr(ledger.ledgerId)
        const l = await ledgerRepo.save(ledger)

        /**
         * create the associated A,L,I,E accounts
         */
        for (const k of [AccountType.A, AccountType.L, AccountType.I, AccountType.E]) {
            const acct = new W3LedgerAccount();
            acct.ledger = l
            acct.accountType = k
            acct.accountId = ledger.ledgerId + ":" + k
            acct.accountHash = Md5.hashAsciiStr(ledger.ledgerId)
            ledger.accounts.push(await acctRepo.save(acct))
        }
        return ledger
    }

    async findWalletLedger(chain:W3Chain|undefined): Promise<W3Ledger|undefined>{
        if (chain == undefined) {
            return undefined
        }
        return await W3Ledger.findOne({
            where: {
                ownerChainId: chain.chaninId,
                ledgerType: LedgerType.WALLET
            },
            relations: ["tenant", "accounts"]
        })
    }
    
    async createNetworkLedger(
        owner: W3Chain, 
        partnerChainId: string, 
        ledgerEntityRefId: string): Promise<W3Ledger> {
        const ledger = await this.createLedger(owner, partnerChainId, ledgerEntityRefId)

        console.log("created source ledger: ", {
            id: ledger.id,
            ledgerId: ledger.ledgerId,
            ownerChainId: ledger.ownerChainId,
            partnerChainId: ledger.partnerChainId,
            accounts: ledger.accounts.map((a) => { return [a.id, a.accountType] })
        })
        /**
         * other side
         */
        await this.notifyW3LedgerConnect(ledger)

        return ledger
    }

    async createLedger(owner: W3Chain, partnerChainId: string, ledgerEntityRefId: string): Promise<W3Ledger> {
        const ledgerRepo = getConnection().getRepository(W3Ledger)
        const acctRepo = getConnection().getRepository(W3LedgerAccount)

        /**
         * create W3Ledger
         */
        const ledger = new W3Ledger();
        ledger.tenant = owner.tenant;
        ledger.ledgerType = LedgerType.W3LEDGER
        ledger.ownerChainId = owner.chaninId;
        ledger.partnerChainId = partnerChainId;
        ledger.entityRefId = ledgerEntityRefId;
        ledger.ledgerId = "hash:" + owner.chaninId + ":" + partnerChainId + ":" + ledgerEntityRefId
        ledger.accounts = []
        ledger.ledgerHash = Md5.hashAsciiStr(ledger.ledgerId)
        const l = await ledgerRepo.save(ledger)

        /**
         * create the associated A,L,I,E accounts
         */
        for (const k of [AccountType.A, AccountType.L, AccountType.I, AccountType.E]) {
            const acct = new W3LedgerAccount();
            acct.ledger = l
            acct.accountType = k
            acct.accountId = ledger.ledgerId + ":" + k
            acct.accountHash = Md5.hashAsciiStr(ledger.ledgerId)
            ledger.accounts.push(await acctRepo.save(acct))
        }
        return ledger
    }

    async notifyW3LedgerConnect(ledger: W3Ledger): Promise<W3Ledger | undefined> {
        return this.doW3LedgerConnect(ledger)
    }

    async doW3LedgerConnect(partnerLedger: W3Ledger): Promise<W3Ledger | undefined> {
        const chainRepo = getConnection().getRepository(W3Chain)
        const ledgerRepo = getConnection().getRepository(W3Ledger)
        const acctRepo = getConnection().getRepository(W3LedgerAccount)

        const chain = await chainRepo.findOne({
            where: {
                chaninId: partnerLedger.partnerChainId
            },
            relations: ["tenant"]
        })

        if (!chain) {
            console.log("error: chain not found trying to process W3LedgerConnect")
            return undefined
        }

        let ledger = await W3Ledger.findOne({
            where:{
                ownerChainId: chain.chaninId,
                partnerChainId: partnerLedger.ownerChainId,
                entityRefId:partnerLedger.entityRefId
            }
        })
        if( ledger != undefined ) {
            console.log("found ledger on other side: not creating one.")
            return ledger
        }

        ledger = new W3Ledger();
        // ledgerId should be same on both sides.
        ledger.ledgerId = partnerLedger.ledgerId;
        ledger.ledgerType = LedgerType.W3LEDGER;
        ledger.tenant = chain.tenant;
        ledger.ownerChainId = chain.chaninId;
        ledger.partnerChainId = partnerLedger.ownerChainId;
        ledger.entityRefId = partnerLedger.entityRefId;
        ledger.accounts = []
        ledger.ledgerHash = Md5.hashAsciiStr(ledger.ledgerId)
        const l = await ledgerRepo.save(ledger)


        for (const partnerAcct of partnerLedger.accounts) {
            const acct = new W3LedgerAccount();
            acct.ledger = l
            acct.accountType = W3Ledger.peerAccountType(partnerAcct.accountType)
            acct.accountId = ledger.ledgerId + ":" + acct.accountType
            acct.accountHash = Md5.hashAsciiStr(ledger.ledgerId)
            l.accounts.push(await acctRepo.save(acct))
        }
        console.log("created destination ledger: ", {
            id: l.id,
            ledgerId: l.ledgerId,
            ownerChainId: l.ownerChainId,
            partnerChainId: l.partnerChainId,
            accounts: l.accounts.map((a) => { return [a.id, a.accountType] })
        })
        return l
    }

    // A[+];DR [-];CR <=> L[+];CR [-];DR
    // R[+];CR [-];DR <=> E[+];DR [-];CR
    async applyPayment(
        fromLedger: W3Ledger, 
        txnType: string, 
        payment: Payment, 
        txnRefId: string,
        activityDate: Date = new Date()): Promise<string | undefined> {
        const activityRepo = getConnection().getRepository(W3LedgerAccountActivity)
        const ledgerRepo = getConnection().getRepository(W3Ledger)

        if( activityDate == null || activityDate === undefined ) {
            activityDate = new Date();
        }

        const ledgerRule = __LEDGER_RULES__.get(txnType)
        if (ledgerRule == undefined) {
            console.log("error: invalid transaction type", txnType);
            return undefined
        }
        /**
         * the other side
         * TODO: should be done in a distributed approach: Phase-1a
         */
        const partnerLedger = await ledgerRepo.findOne({
            where: {
                ownerChainId: fromLedger.partnerChainId,
                ledgerId: fromLedger.ledgerId
            },
            relations: ["tenant", "accounts"]
        })

        if (!partnerLedger) {
            console.log("error: partner ledger not found");
            return undefined
        }

        const ownerChain = await W3Chain.findOne({where:{chaninId: fromLedger.ownerChainId}})
        const fromWalletLedger = await this.findWalletLedger(ownerChain)
        if( fromWalletLedger === undefined ) {
            console.log("error: invalid wallet address")
            return undefined
        }
        const fromWalletAcct = fromWalletLedger.findAccount(AccountType.A)
        if( fromWalletAcct === undefined || fromWalletAcct == null ) {
            console.log("error: wallet account not found, ledger:", {
                ledgerId: fromWalletLedger.ledgerId,
                accountType: AccountType.A
            });
            return
        }

        const partnerChain = await W3Chain.findOne({where:{chaninId: partnerLedger.ownerChainId}})
        const toWalletLedger = await this.findWalletLedger(partnerChain)
        if( toWalletLedger === undefined ) {
            console.log("error: invalid wallet address")
            return undefined
        }

        const toWalletAcct = toWalletLedger.findAccount(AccountType.A)
        if( toWalletAcct === undefined || toWalletAcct == null ) {
            console.log("error: wallet account not found, ledger:", {
                ledgerId: toWalletLedger.ledgerId,
                accountType: AccountType.A
            });
            return
        }

        const activityKey = randomUUID();
        let totalAmount = 0;
        const paymentTypes = Object.keys(payment)
        for (const paymentType of paymentTypes) {
            const amt = payment[paymentType as keyof Payment]
            if (amt != undefined && amt.amount > 0) {
                totalAmount += amt.amount
                const rule = ledgerRule[paymentType as keyof Payment]
                if (rule != undefined) {
                    const acct = fromLedger.findAccount(rule.acctType)
                    if (!acct) {
                        console.log("error: account not found, ledger:", {
                            ledgerId: fromLedger.ledgerId,
                            accountType: rule.acctType
                        });
                        return
                    }
                    console.log("apply txn at source:", {
                        acct: {
                            id: acct.id,
                            accountType: acct.accountType
                        },
                        txnRefId: txnRefId,
                        amt
                    })
                    const a1 = new W3LedgerAccountActivity()
                    a1.ledgerAccount = acct
                    a1.activityType = rule.activityType
                    a1.amount = amt.amount
                    a1.currency = amt.currency
                    a1.cf = W3Ledger.cf(acct.accountType, rule.activityType)
                    a1.activityDate = activityDate
                    a1.activityKey = activityKey
                    a1.txnRefId = txnRefId
                    a1.description = amt.description
                    await activityRepo.save(a1)

                    const peerAccountType = (rule.isTransfer) ? rule.acctType : W3Ledger.peerAccountType(rule.acctType)
                    const partnerAcct = partnerLedger.findAccount(peerAccountType)
                    if (!partnerAcct) {
                        console.log("error: partner account not found:", {
                            ledgerId: partnerLedger.ledgerId,
                            accountType: peerAccountType
                        });
                        return
                    }
                    console.log("apply txn at destination:", {
                        acct: {
                            id: partnerAcct.id,
                            accountType: partnerAcct.accountType
                        },
                        txnRefId: a1.txnRefId,
                        amt
                    })
                    const peerActivityType = W3Ledger.peerActivity(rule.activityType)
                    const a2 = new W3LedgerAccountActivity()
                    a2.ledgerAccount = partnerAcct
                    a2.activityType = peerActivityType
                    a2.amount = amt.amount
                    a2.cf = W3Ledger.cf(partnerAcct.accountType, peerActivityType)
                    a2.currency = amt.currency
                    a2.description = amt.description
                    a2.activityDate = activityDate
                    a2.activityKey = activityKey
                    a2.partnerTxnRefId = a1.txnRefId
                    await activityRepo.save(a2)

                    if( fromLedger.ownerChainId != partnerLedger.ownerChainId ) {
                        /**
                         * transfer funds between wallets only if they are different.
                         * need to think about this further.
                         */                    
                        const wa1 = new W3LedgerAccountActivity()
                        wa1.ledgerAccount = fromWalletAcct
                        wa1.activityType = ActivityType.CR
                        wa1.amount = amt.amount
                        wa1.currency = amt.currency
                        wa1.cf = W3Ledger.cf(fromWalletAcct.accountType, ActivityType.CR)
                        wa1.activityDate = activityDate
                        wa1.activityKey = activityKey
                        wa1.txnRefId = txnRefId
                        wa1.description = amt.description
                        await activityRepo.save(wa1)

                        const wa2 = new W3LedgerAccountActivity()
                        wa2.ledgerAccount = toWalletAcct
                        wa2.activityType = ActivityType.DR
                        wa2.amount = amt.amount
                        wa2.currency = amt.currency
                        wa2.cf = W3Ledger.cf(toWalletAcct.accountType, ActivityType.DR)
                        wa2.activityDate = activityDate
                        wa2.activityKey = activityKey
                        wa2.txnRefId = txnRefId
                        wa2.description = amt.description
                        await activityRepo.save(wa2)
                    }
                    
                }
            }
        }
        //this.xfrFunds(fromLedger,partnerLedger,payment,txnRefId)
        return activityKey;
    }

}