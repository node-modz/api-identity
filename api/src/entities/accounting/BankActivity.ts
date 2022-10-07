import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Activity } from './Activity';

export enum  ActivityType {
    Deposit = "bank.deposit",
    Withdrawal = "bank.withdrawal"
}

@ObjectType()
@Entity()
export class BankActivity extends Activity {   
    
    @Field()
    @Column()
    activityType: ActivityType;  

    @Field()
    @Column({ type: "float4"} )
    amount: number
    
    @Field({nullable:true})
    @Column({nullable:true})
    reference!: string   

    @Field({nullable:true})
    @Column({nullable:true})
    description!: string   
}   