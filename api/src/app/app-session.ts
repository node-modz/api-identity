import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    userId: string
    oauth2: {
      request: any
    }
  }
}

declare global {
  namespace Express {
    interface AuthUser {
      id: string | number,
      roles?: string[];
      /**
       * morphed by an another user, mostly an admin
       */
      morphedBy?: AuthUser | undefined;
      [key: string]: any;
    }

    interface AuthToken {
      sub?:string;
      exp: number;
      scope: string[];
      cid: string | undefined;    
      user?: AuthUser | undefined;
    }

    interface AuthContext {
      loaded?: boolean;
      user? : AuthUser | undefined;
      token?: AuthToken | undefined;
      context : "session" | "token";      
    }

    interface Request {
      authContext? : AuthContext | undefined;
    }
  }
}