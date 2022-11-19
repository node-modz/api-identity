import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Login } from './Login';
import { Tenant } from './Tenant';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ unique: true })
    email!: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;

    @Field()
    @Column({nullable:true})
    firstName!: string;
    
    @Field()
    @Column({nullable:true})
    lastName!: string;
    
    @OneToOne(()=>Tenant)
    @JoinColumn()
    tenant?: Tenant

    @Field()
    @Column({nullable:true})
    avatar:string

}