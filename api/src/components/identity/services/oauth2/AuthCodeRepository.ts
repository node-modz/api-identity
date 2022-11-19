import { Repository } from "typeorm";
import { DateInterval, generateRandomToken, OAuthAuthCodeRepository } from "../../lib/oauth2";

import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../entities/identity/User";
import { AuthCode } from "../../entities/oauth2/AuthCode";
import { Client } from "../../entities/oauth2/Client";
import { Scope } from "../../entities/oauth2/Scope";

@Service()
export class AuthCodeRepository implements OAuthAuthCodeRepository {

  @InjectRepository(AuthCode)
  private readonly authCodeRepository: Repository<AuthCode>
  
  constructor() {}

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
    //authCode.user = user;
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
