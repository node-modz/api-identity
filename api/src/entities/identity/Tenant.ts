import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@ObjectType()
@Entity()
export class Tenant extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column()
    name!: string;
    
    @Field()
    @Column()
    description!: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;
}