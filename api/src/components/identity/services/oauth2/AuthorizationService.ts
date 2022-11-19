import { Inject, Service } from "typedi";
import { AuthorizationServer, JwtInterface, OAuthAuthCodeRepository, OAuthClientRepository, OAuthScopeRepository, OAuthTokenRepository, OAuthUserRepository } from "../../lib/oauth2"

@Service()
export class AuthorizationService extends AuthorizationServer {
    constructor(
        @Inject()
        private readonly authCodeRepo: OAuthAuthCodeRepository,
        @Inject()
        private readonly clientRepo: OAuthClientRepository,
        @Inject()
        private readonly tokenRepo: OAuthTokenRepository,
        @Inject()
        private readonly scopeRepo: OAuthScopeRepository,
        @Inject()
        private readonly userRepo: OAuthUserRepository,
        @Inject()
        private readonly jwtI: JwtInterface
    ) {
        super(
            authCodeRepo,
            clientRepo,
            tokenRepo,
            scopeRepo,
            userRepo,
            jwtI,{}
        );
    }
}