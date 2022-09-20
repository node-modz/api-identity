import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './User';

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
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

}
  