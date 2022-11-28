import { Log, User, UserManager } from 'oidc-client';
import { APP_CONFIG } from '../../../app/AppConfig';
import { Service } from 'typedi'
import 'reflect-metadata'

@Service()
export class AuthService {
    public userManager: UserManager;
    constructor() {        
        const settings = {
            authority: APP_CONFIG.identity.client.authority,            
            client_id: APP_CONFIG.identity.client.client_id,
            scope: APP_CONFIG.identity.client.scopes,
            redirect_uri: `${APP_CONFIG.appHost}/identity/signin-callback`,
            silent_redirect_uri: `${APP_CONFIG.appHost}/identity/silent-renew`,
            post_logout_redirect_uri: `${APP_CONFIG.appHost}`,
            response_type: 'code',            
        };
        this.userManager = new UserManager(settings);

        Log.logger = console;
        Log.level = Log.DEBUG;
    }
    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }

    public login(queryParams:any): Promise<void> {
        //this.userManager.signinRedirectCallback()
        return this.userManager.signinRedirect(queryParams);
    }

    public renewToken(): Promise<User> {
        return this.userManager.signinSilent();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }
}