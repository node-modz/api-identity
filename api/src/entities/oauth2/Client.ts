import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { GrantIdentifier, OAuthClient } from "../../oauth2";

import { Scope } from "./Scope";

@Entity("oauth_clients")
export class Client  extends BaseEntity implements OAuthClient {

  @PrimaryColumn()
  id!: string

  // @Column("uuid")
  // readonly client_id!: string;

  @Column("varchar", { length: 128, nullable: true })
  // @Length(64, 128)
  // @IsOptional()
  secret?: string;

  @Column("varchar", { length: 128 })
  name!: string;

  @Column("simple-array")
  redirectUris!: string[];

  @Column("simple-array")
  allowedGrants!: GrantIdentifier[];

  @ManyToMany(() => Scope, { onDelete: "CASCADE", onUpdate: "CASCADE", cascade:true })
  @JoinTable({
    name: "oauth_client_scopes",
    joinColumn: { name: "clientId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "scopeId", referencedColumnName: "id" },
  })
  scopes!: Scope[];

  @CreateDateColumn()
  createdAt!: Date;
}
