import { BaseEntity, Column, Unique, CreateDateColumn, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'


@Entity()
@Unique(["provider","providerId"])
export class IdpConnect extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    provider: string

    @Column()
    providerId: string

    @Column({nullable:true})
    profileUrl: string

    @Column({type:'json'})
    data: string

    @Column({type:'uuid'})
    userId: string

    @Column()
    verified: boolean

    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
}