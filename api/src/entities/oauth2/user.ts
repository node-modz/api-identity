import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { OAuthUser } from "@jmondi/oauth2-server";

@Entity({name:"oauth_user"})
export class User implements OAuthUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;
}
