import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'


@ObjectType()
@Entity()
export class Login extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;

    // this is true if the member registers with social accounts
    @Column()
    isExternal: boolean = false;

    @Column()
    enabled: boolean = true;

    @Column()
    accountExpired: boolean = false;

    @Column()
    accountLocked: boolean = false;

    @Column()
    passwordExpired: boolean = false;

}