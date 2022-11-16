import { Repository } from "typeorm";
import { ExtraAccessTokenFields, GrantIdentifier, OAuthUserRepository 
} from "../../oauth2";

import { Client } from "../../entities/oauth2/Client";
import { User } from "../../entities/identity/User";
import { Inject, Service } from "typedi";
import { UserService } from "../identity/UserService";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class UserRepository implements OAuthUserRepository {

  @Inject()
  private readonly userService: UserService;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;


  async getUserByCredentials(
    identifier: string,
    password?: string,
    grantType?: GrantIdentifier,
    client?: Client,
  ): Promise<User|undefined> {
    if( !password ) {
      const user = await this.userRepository.findOneOrFail({ id: identifier });
      // verity password and if user is allowed to use grant, etc...
      return user;
    } else {
      return await this.userService.findByCredentials(identifier,password)      
    }
    
  }

  async extraAccessTokenFields(user: User): Promise<ExtraAccessTokenFields | undefined> {
    return { 
      mail: user.email, 
      name: `${user.firstName} ${user.lastName}`,
      sub: user.id,
    };
  }
}
