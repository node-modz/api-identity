
export function wellknown(host:string) {
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
    };
    return json;
}