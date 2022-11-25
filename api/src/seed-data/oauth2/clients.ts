const clientList = [
  { 
    name: "web-client", 
    id: "web-client",
    secret: "web-secret", 
    redirectUris:["http://localhost:4000/login/local/cb","http://localhost:4000/login/w3l/cb"],
    allowedGrants: [ "authorization_code", "refresh_token" ],
    scopes:[
      { name:"identity:profile" },
      { name:"accounting:*" }, 
      { name:"dachain:*" } 
    ]
  },
  { 
    name: "public-client", 
    id:"public-client",
    redirectUris:["http://localhost:4000/login/w3l/cb"],
    allowedGrants: [ "authorization_code","refresh_token" ],
    scopes:[
      { name:"identity:profile" },
      { name:"accounting:*" }, 
      { name:"dachain:*" } 
    ]
  },
  { 
    name: "react-oidc-client", 
    id: "react-oidc-client",
    redirectUris:["http://localhost:3000/signin-callback.html","http://localhost:3000/identity/signin-callback"],
    allowedGrants: [ "authorization_code", "refresh_token" ],
    scopes:[
      { name:"openid" },
      { name:"profile" },
      { name:"identity:profile" },
      { name:"accounting:*" }, 
      { name:"dachain:*" } 
    ]
  },
  { 
    name: "service-to-service", 
    id: "service-to-service",
    secret: "sts-secret", 
    redirectUris:[],
    allowedGrants: [ "client_credentials", "refresh_token" ],
    scopes:[
      { name:"openid" },
      { name:"profile" },
      { name:"identity:profile" },
      { name:"accounting:*" }, 
      { name:"dachain:*" } 
    ]
  },
  { 
    name: "password-client", 
    id: "password-client",
    secret: "pc-secret", 
    redirectUris:[],
    allowedGrants: [ "password", "refresh_token" ],
    scopes:[
      { name:"openid" },
      { name:"profile" },
      { name:"identity:profile" },
      { name:"accounting:*" }, 
      { name:"dachain:*" } 
    ]
  },
  
];

export default clientList;

