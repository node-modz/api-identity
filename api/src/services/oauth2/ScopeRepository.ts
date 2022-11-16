import { In, Repository } from "typeorm";
import { GrantIdentifier, OAuthScope, OAuthScopeRepository 
} from "../../oauth2";

import { Client } from "../../entities/oauth2/Client";
import { Scope } from "../../entities/oauth2/Scope";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

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
