import { Field, GraphQLTimestamp, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Post } from './Post';

@ObjectType()
export abstract class Activity extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column()
    activityDate!: Date;
    
    @Field(() => GraphQLTimestamp)
    @CreateDateColumn()
    createdAt!: Date;
  
    @Field(() => GraphQLTimestamp)
    @UpdateDateColumn()
    updatedAt!: Date;
}