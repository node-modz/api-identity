import { createContext, ReactNode, useEffect, useState } from 'react';
import { Client, useClient } from 'urql';
import { MeDocument, MeQuery, MeQueryVariables, Token } from '../graphql/graphql';


export const TOKEN_KEY = "ldgr.token";
export const USERINFO_KEY = "ldgr.userInfo";
export const EXPIRESAT_KEY = "ldgr.expiresAt";
export const IS_ELECTRON = "ldgr.app.isElectron";

interface AuthState {
    token: string;
    userInfo: any;
    expiresAt: number;
}
const DEFAULT_STATE = {
    token: "",
    userInfo: JSON.parse("{}"),
    expiresAt: 0,
}

const AuthContext = createContext<{
    authState?: AuthState,
    setAuthState?: (s: AuthState) => void
    logout?: () => void
    isAuthenticated: () => boolean
    hasRole?: (r: string) => boolean
}>({ authState: loadAuthState(), isAuthenticated: () => { return false } });



export function loadAuthState(): AuthState {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY);
        const userInfo = localStorage.getItem(USERINFO_KEY);
        const expiresAt = localStorage.getItem(EXPIRESAT_KEY);
        const authState = {
            token: token ? token : "",
            userInfo: userInfo ? JSON.parse(userInfo) : JSON.parse("{}"),
            expiresAt: Number(expiresAt),
        }
        console.log("AuthProvider:loadAuthState loading from storage: ", authState);
        return authState;
    }
    console.log("AuthProvider:loadAuthState returning default storage: ", DEFAULT_STATE);
    return DEFAULT_STATE
}

// export function setAuthState(client:Client) {
//     client.query<MeQuery, MeQueryVariables>(MeDocument, {})
//     .toPromise()
//     .then(result => {
//         const { data } = result
//         if (data?.me && data?.me.tokenInfo) {
//             console.log("in provider: setting state");
//             storeToken(data?.me.tokenInfo);
//         }
//     })
// }

function storeToken(tokenInfo: Token) {
    const token = tokenInfo.token;
    const userInfo = JSON.parse(tokenInfo.userInfo as string);
    const expiresAt = tokenInfo.expiresAt;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERINFO_KEY, JSON.stringify(userInfo));
    localStorage.setItem(EXPIRESAT_KEY, expiresAt.toString());
    localStorage.setItem(IS_ELECTRON, process.versions.hasOwnProperty('electron') ? "true" : "false");
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERINFO_KEY);
    localStorage.removeItem(EXPIRESAT_KEY);
}

// TODO: secure routes..
const AuthProvider = (props:any) => {
    const { astate, children } = props;

    console.log("AuthProvider: loading application auth provider/context");
    const client = useClient()
    let state = astate ?? loadAuthState();
    const [authState, setAuthState] = useState(state);

    // Loaded once after DOM is loaded.
    useEffect(() => {
        console.log("In AuthProvider:useEffect()", "token=", state.token);
        client.query<MeQuery, MeQueryVariables>(MeDocument, {})
            .toPromise()
            .then(result => {
                const { data } = result
                if (data?.me && data?.me.tokenInfo) {
                    console.log("in provider: setting state");
                    setAuthInfo(data?.me.tokenInfo);
                }
            })
    }, [])
    ////

    const setAuthInfo = (tokenInfo: Token) => {
        console.log("AuthProvider:setting login state", tokenInfo);
        const token = tokenInfo.token;
        const userInfo = JSON.parse(tokenInfo.userInfo as string);
        const expiresAt = tokenInfo.expiresAt;

        storeToken(tokenInfo);
        setAuthState({ token, userInfo, expiresAt, })
    }

    const onLogout = () => {
        console.log("provider: onLogout")
        clearToken();
        setAuthState(DEFAULT_STATE);
    }

    const isAuthenticated = (): boolean => {
        if (typeof window === 'undefined') return false
        if (!authState.token || !authState.expiresAt) {
            return false;
        }
        return (
            new Date().getTime() / 1000 < authState.expiresAt
        );
    }
    const hasRole = (role: string): boolean => {
        return authState.userInfo["role"] === role;
    }

    return (
        <AuthContext.Provider value={{
            authState: authState,
            setAuthState: (authInfo: AuthState) => setAuthInfo(authInfo),
            logout: onLogout,
            isAuthenticated: isAuthenticated,
            hasRole: hasRole,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };
