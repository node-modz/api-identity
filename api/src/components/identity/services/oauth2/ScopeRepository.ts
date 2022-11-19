import { In, Repository } from "typeorm";
import { GrantIdentifier, OAuthScope, OAuthScopeRepository } from "../../lib/oauth2";

import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Client } from "../../entities/oauth2/Client";
import { Scope } from "../../entities/oauth2/Scope";

@Service()
export class ScopeRepository implements OAuthScopeRepository {

  @InjectRepository(Scope)
  private readonly scopeRepo: Repository<Scope>
  

  async getAllByIdentifiers(scopeNames: string[]): Promise<OAuthScope[]> {
    return this.scopeRepo.find({ where: { name: In([...scopeNames]) } });
  }

  async finalize(
    scopes: OAuthScope[],
    identifier: GrantIdentifier,
    client: Client,
    user_id?: string,
  ): Promise<OAuthScope[]> {
    return scopes;
  }
}
