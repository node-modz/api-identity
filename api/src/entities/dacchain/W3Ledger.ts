import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, Long, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Tenant } from '../identity/Tenant';
import { W3LedgerAccount } from './W3LedgerAccount';

export enum AccountType {
    A = "w3l.asset",
    L = "w3l.liability",
    I = "w3l.income",
    E = "w3l.expense"
}
export enum ActivityType {
    DR = "w3l.debit",
    CR = "w3l.credit"
}
export enum LedgerType {
    WALLET = "w3l.wallet",
    W3LEDGER = "w3l.ledger"
}
export interface Payment {
    principal?: { amount:number, currency:string, description:string }
    interest?: { amount:number, currency:string, description:string }
}

export type LedgerRules = {
    [name in keyof Payment]: {
        isTransfer?:boolean,
        acctType: AccountType;
        activityType: ActivityType;
    };
};

// A[+];DR [-];CR <=> L[+];CR [-];DR
// E[+];DR [-];CR <=> R[+];CR [-];DR
export const __LEDGER_RULES__ = new Map<string, LedgerRules>([
    [
        "seed.xfr", {
            "principal": { isTransfer:true, acctType: AccountType.A, activityType: ActivityType.CR },            
        }
    ],
    [
        "loan.issue", {
            "principal": { acctType: AccountType.A, activityType: ActivityType.DR } 
        }
    ],
    [
        "loan.pay", {
            "principal": { acctType: AccountType.L, activityType: ActivityType.DR },
            "interest": { acctType: AccountType.E, activityType: ActivityType.DR } 
        }
    ],
    [
        "gift.issue", {
            "principal": { isTransfer:true, acctType: AccountType.A, activityType: ActivityType.CR },            
        }
    ],
    [
        "salary.pay", {
            "principal": { acctType: AccountType.E, activityType: ActivityType.DR },            
        }
    ],
    [
        "service.pay", {
            "principal": { acctType: AccountType.E, activityType: ActivityType.DR },            
        }
    ],
])

@ObjectType()
@Entity()
export class W3Ledger extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id!:string

    @ManyToOne(() => Tenant)
    tenant: Tenant

    //W3ChainAccount.chainId
    @Column()
    ownerChainId!: string;
    @Column()
    partnerChainId!: string

    @Column()
    ledgerType:LedgerType

    //reference id for the external application like "loan:loan-id", "gl:gl-acct-id" etc..
    @Column({nullable:true})
    entityRefId!: string

    // @Column({nullable:true})
    // partnerRefId?: string

    //this should be a common interaction id
    //hash([sort(ownerChainId,partnerChainId),endityRefId].join(":"))
    @Column()
    ledgerId!: string

    @Column({nullable:true})
    ledgerHash?: string


    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => W3LedgerAccount, (acct) => acct.ledger)
    accounts: W3LedgerAccount[];


    findAccount(accountType: AccountType): W3LedgerAccount | null {
        for (const acct of this.accounts) {           
            if (acct.accountType.valueOf() === accountType.valueOf()) {
                return acct
            }
        }
        return null
    }

    public static peerActivity(k: ActivityType): ActivityType {
        switch (k) {
            case ActivityType.CR: return ActivityType.DR;
            case ActivityType.DR: return ActivityType.CR;
            default: return k;
        }
    }

    public static peerAccountType(k: AccountType): AccountType {
        switch (k) {
            case AccountType.A: return AccountType.L;
            case AccountType.L: return AccountType.A;
            case AccountType.I: return AccountType.E;
            case AccountType.E: return AccountType.I;
            default: return k;
        }
    }

    // A[+];DR [-];CR <=> L[+];CR [-];DR
    // E[+];DR [-];CR <=> R[+];CR [-];DR
    public static cf(accountType:AccountType,actityType:ActivityType): number {
        switch(accountType+":"+actityType) {
            case AccountType.A+":"+ActivityType.DR:return +1
            case AccountType.A+":"+ActivityType.CR:return -1
            
            case AccountType.L+":"+ActivityType.DR:return -1
            case AccountType.L+":"+ActivityType.CR:return +1

            case AccountType.I+":"+ActivityType.DR:return -1
            case AccountType.I+":"+ActivityType.CR:return +1
            
            case AccountType.E+":"+ActivityType.DR:return +1
            case AccountType.E+":"+ActivityType.CR:return -1
        }
        // should not happen, way to find any potential issues
        return 0; 
    }

    

}