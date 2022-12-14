import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ActivityType } from './W3Ledger';
import { W3LedgerAccount } from './W3LedgerAccount';




@Entity()
export class W3LedgerAccountActivity extends BaseEntity {

    @ManyToOne(() => W3LedgerAccount, (acct) => acct.activity)
    ledgerAccount: W3LedgerAccount

    @PrimaryGeneratedColumn("uuid")
    id!: string

    /**
     * internal key for each transaction, 
     * this should be same on both sides
     */
    @Column()
    activityKey!:string

    /**
     * referenceId of the originator transaction
     */
    @Column({nullable:true})
    txnRefId:string
    
    @Column({nullable:true})
    partnerTxnRefId:string

    @Column()
    activityDate!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column()
    activityType: ActivityType;

    @Column({ type: "int" })
    cf:number

    // we could keep track of this as #units of an asset i.e USD, IBM, APPL etc..
    // USD, IBM, APPL, any digital asset cash/stock/bond
    // @Column()
    // asset: string

    // @Column({ type: "float4" })
    // units: number

    // @Column({ type: "float4" })
    // price: number


    @Column({ type: "float4" })
    amount: number

    // USD, INR, CAD; currency used for purchase of above units
    @Column()
    currency: string

    @Column({ nullable: true })
    reference!: string

    @Column({ nullable: true })
    description!: string
}   