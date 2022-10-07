import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, Long, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Tenant } from '../core/Tenant';


@ObjectType()
@Entity()
export class W3Chain extends BaseEntity {

    @ManyToOne(() => Tenant)
    tenant: Tenant

    @Field()
    @PrimaryGeneratedColumn("uuid")
    chaninId!: string
    
    //reference id for the external application like user:userId, tenant:tenantId etc..
    @Column()
    entityRefId!: string

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;  

}