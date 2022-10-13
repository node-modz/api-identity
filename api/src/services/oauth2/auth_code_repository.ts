import { Repository } from "typeorm";
import { DateInterval, OAuthAuthCodeRepository, generateRandomToken } from "@jmondi/oauth2-server";

import { AuthCode } from "../../entities/oauth2/auth_code";
import { Client } from "../../entities/oauth2/client";
import { Scope } from "../../entities/oauth2/scope";
import { User } from "../../entities/oauth2/user";

export class AuthCodeRepository implements OAuthAuthCodeRepository {
  constructor(private readonly authCodeRepository: Repository<AuthCode>) {}

  getByIdentifier(authCodeCode: string): Promise<AuthCode> {
    return this.authCodeRepository.findOneOrFail(authCodeCode);
  }

  async isRevoked(authCodeCode: string): Promise<boolean> {
    const authCode = await this.getByIdentifier(authCodeCode);
    return authCode.isExpired;
  }

  issueAuthCode(client: Client, user: User | undefined, scopes: Scope[]) {
    const authCode = new AuthCode();
    authCode.code = generateRandomToken();
    authCode.expiresAt = new DateInterval("15m").getEndDate();
    authCode.client = client;
    authCode.clientId = client.id;
    authCode.user = user;
    authCode.userId = user?.id;
    authCode.scopes = [];
    scopes.forEach(scope => authCode.scopes.push(scope));
    return authCode;
  }

  async persist(authCode: AuthCode): Promise<void> {
    await this.authCodeRepository.save(authCode);
  }

  async revoke(authCodeCode: string): Promise<void> {
    const authCode = await this.getByIdentifier(authCodeCode);
    authCode.revoke();
    await this.authCodeRepository.save(authCode);
  }
}
