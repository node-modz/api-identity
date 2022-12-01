import { Log, User, UserManager } from 'oidc-client';
import 'reflect-metadata';
import { Inject, Service } from 'typedi';
import type { IdentityConfigOptions } from '../IdentityConfigOptions';

@Service()
export class AuthService {
    public userManager: UserManager;

    constructor(
        @Inject('AppConfig')
        private readonly appConfig: any,

        @Inject('IdentityConfigOptions')
        private readonly identityConfig: IdentityConfigOptions
    ) {
        const settings = {
            authority: this.identityConfig.client.authority,
            client_id: this.identityConfig.client.client_id,
            scope: this.identityConfig.client.scopes,
            redirect_uri: `${this.appConfig.appHost}/identity/signin-callback`,
            silent_redirect_uri: `${this.appConfig.appHost}/identity/silent-renew`,
            post_logout_redirect_uri: `${this.appConfig.appHost}`,
            response_type: 'code',
        };
        this.userManager = new UserManager(settings);

        Log.logger = console;
        Log.level = Log.DEBUG;
    }
    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }

    public login(queryParams: any): Promise<void> {
        return this.userManager.signinRedirect(queryParams);
    }

    public renewToken(): Promise<User> {
        return this.userManager.signinSilent();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }
}