import { Repository } from "typeorm";
import { GrantIdentifier, OAuthClient, OAuthClientRepository } from "../../lib/oauth2";

import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { Client } from "../../entities/oauth2/Client";

@Service()
export class ClientRepository implements OAuthClientRepository {

  @InjectRepository(Client)
  private readonly clientRepo: Repository<Client>

  constructor() {}

  async getByIdentifier(clientId: string): Promise<Client> {
    return this.clientRepo.findOneOrFail( { where:{id:clientId}, relations: ["scopes"] });
  }

  async isClientValid(grantType: GrantIdentifier, client: OAuthClient, clientSecret?: string): Promise<boolean> {
    if (client.secret && client.secret !== clientSecret) {
      return false;
    }
    return client.allowedGrants.includes(grantType);
  }
}
