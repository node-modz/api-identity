import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { OAuthScope } from "../../lib/oauth2";

@Entity("oauth_scopes")
export class Scope extends BaseEntity implements OAuthScope {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;
}
