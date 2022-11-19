import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, Long, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { W3Ledger, AccountType } from './W3Ledger';
import { W3LedgerAccountActivity } from './W3LedgerAccountActivity';



@ObjectType()
@Entity()
export class W3LedgerAccount extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id!:string

    @ManyToOne(() => W3Ledger, (l) => l.accounts)
    ledger: W3Ledger

    @Column()
    accountType: AccountType

    //this will be primary key
    //ledger.id+":"+accountType
    @Column()
    accountId!: string    
    
    
    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;  

    @Column({ type: "float4", default: 0.0 } )
    balance: number

    @Column({nullable:true})
    accountHash?: string

    @OneToMany(()=>W3LedgerAccountActivity,(a)=>a.ledgerAccount)
    activity: W3LedgerAccountActivity[];

}