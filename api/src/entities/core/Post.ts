import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User';

//
// TODO: for now keeping this here, 
// to completely remote it later or move to an appropriate module.
//
@ObjectType("Post")
@Entity()
export class Post  extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(()=>String)
  @CreateDateColumn()
  createdAt: Date = new Date();

  @Field(()=>String)
  @UpdateDateColumn()
  updatedAt: Date = new Date();

  @Field(() => String)
  @Column({ type: "text" })
  title!: string;

  @Field(() => String)
  @Column({type:"text"})
  text!: string;

  @Field(()=>User)
  @ManyToOne(() => User)
  creator: User;

}
  