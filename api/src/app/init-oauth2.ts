import { AppContext } from "./init-context";
import { json, urlencoded } from "body-parser";
import Express from "express";
import { Connection, createConnection, getConnection } from "typeorm";
import { AuthorizationServer, DateInterval, JwtService } from "@jmondi/oauth2-server";
import {
  requestFromExpress,
  handleExpressError,
  handleExpressResponse,
} from "@jmondi/oauth2-server/dist/adapters/express";

import { AuthCode } from "../entities/oauth2/auth_code";
import { Client } from "../entities/oauth2/client";
import { Scope } from "../entities/oauth2/scope";
import { Token } from "../entities/oauth2/token";
import { User } from "../entities/oauth2/user";
import { AuthCodeRepository } from "../services/oauth2/auth_code_repository";
import { ClientRepository } from "../services/oauth2/client_repository";
import { ScopeRepository } from "../services/oauth2/scope_repository";
import { TokenRepository } from "../services/oauth2/token_repository";
import { UserRepository } from "../services/oauth2/user_repository";

const init = async (appCtxt: AppContext) => {
  console.log(appCtxt.name, ": init oauth")
  console.log(appCtxt.name, { secret: process.env.OAUTH_CODES_SECRET })

  const connection: Connection = getConnection();

  const authorizationServer = new AuthorizationServer(
    new AuthCodeRepository(connection.getRepository(AuthCode)),
    new ClientRepository(connection.getRepository(Client)),
    new TokenRepository(connection.getRepository(Token)),
    new ScopeRepository(connection.getRepository(Scope)),
    new UserRepository(connection.getRepository(User)),
    new JwtService(process.env.OAUTH_CODES_SECRET!),
  );

  authorizationServer.enableGrantTypes(
    ["authorization_code", new DateInterval("15m")],
    ["client_credentials", new DateInterval("1d")],
    "refresh_token",
    "password",
    "implicit",
  );

  appCtxt.http.use(json());
  appCtxt.http.use(urlencoded({ extended: false }));


  //TODO: move the routes to routes/oauth.ts
  // client: {id,scopes,redirect_uri..}
  // 1. /oauth2/authorize
  //      params:{
  //        client_id=XXX,
  //        redirect_uri=XXX,
  //        response_type=XXX,
  //        scope=XXX, 
  //        state=XXX,
  //        code_challenge=XXX,
  //        code_challenge_method=XXX}
  //      if( !logged-in )     { 
  //         authReq = create-auth-req(params, {satuts:'oauth2.authorize'});
  //         create-session({authReqId:authReq.id})
  //         redirect: /auth/login
  //       }
  // 2a. GET:/auth/login        { 
  //      render: {
  //         'auth/login', {csrf:new CSRFToken()}  
  //      }
  // 2b. POST:/auth/login
  //      if valid(username,password) { 
  //         update-auth-req(session.authReqId,{status:'auth.success'});
  //         authCode= create-auth-code(session.authReqId)
  //         redirect: redirect_uri?code=authCode.id
  //      }
  //      on-failure {
  //         render('/auth/login')
  //      }
  // 3a.  GET:/auth/consent
  // 3b. POST:/auth/consent
  //      if( session.authReq.status == 'auth.success') {
  //        if( auto-consent ) {
  //          update-auth-req(session.authReqId,'oauth2.code')
  //          authCode = create-auth-code(session.authReqId,{scopes:",,,"}) //new scopes if needed
  //          redirect : redirect_uri?code=authCode.id
  //      } else {
  //        // invalid consent request redirect to login
  //        redirect: '/auth/login'
  //      }  
  // 4. POST:/oauth2/token
  //      params:{
  //        client_id=XXX
  //        code=XXX&
  //        redirect_uri=XXX&
  //        code_verifier=XXX&
  //        grant_type=authorization_code
  //      }
  //      if ( valid-code(code,client_id,code_verifier) ) {
  //        authCode = session.authReqId
  //        create-jwt-token(authCode)
  //      }
  // 4. /auth/logout
  appCtxt.http.get("/authorize", async (req: Express.Request, res: Express.Response) => {
    try {
      // Validate the HTTP request and return an AuthorizationRequest object.
      const authRequest = await authorizationServer.validateAuthorizationRequest(requestFromExpress(req));

      // The auth request object can be serialized and saved into a user's session.
      // You will probably want to redirect the user at this point to a login endpoint.

      // Once the user has logged in set the user on the AuthorizationRequest
      console.log("Once the user has logged in set the user on the AuthorizationRequest");
      authRequest.user = { id: "abc", email: "user@example.com" };

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.

      // Once the user has approved or denied the client update the status
      // (true = approved, false = denied)
      authRequest.isAuthorizationApproved = true;

      // Return the HTTP redirect response
      const oauthResponse = await authorizationServer.completeAuthorizationRequest(authRequest);
      return handleExpressResponse(res, oauthResponse);
    } catch (e) {
      handleExpressError(e, res);
    }
  });

  appCtxt.http.post("/token", async (req: Express.Request, res: Express.Response) => {
    try {
      const oauthResponse = await authorizationServer.respondToAccessTokenRequest(req);
      return handleExpressResponse(res, oauthResponse);
    } catch (e) {
      handleExpressError(e, res);
      return;
    }
  });

  appCtxt.http.get("/", (req: Express.Request, res: Express.Response) => {
    res.json({
      success: true,
      GET: ["/authorize"],
      POST: ["/token"],
    });
  });

  appCtxt.http.get("/.well-known/openid-configuration", async (req: Express.Request, res: Express.Response) => {
    const host = "http://localhost:4001"
    const json = {
      "authorization_endpoint": `${host}/authorize`,
      "end_session_endpoint": `${host}/logout`,
      "token_endpoint": `${host}/token`,
      "userinfo_endpoint": `${host}/userinfo`,
      "revocation_endpoint": `${host}/revoke`,
      "jwks_uri": `${host}/.well-known/jwks.json`,
      "issuer": `${host}`,
      "grant_types_supported": [
        "authorization_code",
        "implicit",
        "client_credentials",
        "refresh_token"
      ],
      "backchannel_logout_session_supported": true,
      "backchannel_logout_supported": true,
      "claims_parameter_supported": false,
      "claims_supported": ["sub"],
      "code_challenge_methods_supported": ["plain", "S256"],
      "frontchannel_logout_session_supported": true,
      "frontchannel_logout_supported": true,
      "id_token_signing_alg_values_supported": ["RS256"],
      "request_object_signing_alg_values_supported": ["RS256", "none"],
      "request_parameter_supported": true,
      "request_uri_parameter_supported": true,
      "require_request_uri_registration": true,
      "response_modes_supported": [
        "query", 
        "fragment"
      ],
      "response_types_supported": [
        "code",
        "code id_token",
        "id_token",
        "token id_token",
        "token",
        "token id_token code"
      ],
      "scopes_supported": [
        "offline_access",
        "offline",
        "openid"
      ],
      "subject_types_supported": ["public"],
      "token_endpoint_auth_methods_supported": [
        "client_secret_post",
        "client_secret_basic",
        "private_key_jwt",
        "none"
      ],
      "userinfo_signing_alg_values_supported": [
        "none", 
        "RS256"
      ]
    }
    res.json(json);
  });


  console.log(appCtxt.name, ": init oauth: done")
}

export { init as initOAuth };
export default init;