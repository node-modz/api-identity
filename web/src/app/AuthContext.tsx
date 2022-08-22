
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { Token } from '../generated/graphql';
import { useMeQuery } from "../generated/graphql"

const TOKEN_KEY = "ldgr.token";
const USERINFO_KEY = "ldgr.userInfo";
const EXPIRESAT_KEY = "ldgr.expiresAt"

interface AuthState {
    token: string;
    userInfo: any;
    expiresAt: number;
}
const DEFAULT_STATE = {
    token: "",
    userInfo: JSON.parse("{}"),
    expiresAt: 0
}

const AuthContext = createContext<{
    authState?: AuthState,
    setAuthState?: (s: AuthState) => void
    logout?:() => void
    isAuthenticated?:()=>boolean
}>({});



function loadAuthState(): AuthState {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_KEY);
        const userInfo = localStorage.getItem(USERINFO_KEY);
        const expiresAt = localStorage.getItem(EXPIRESAT_KEY);
        return {
            token: token ? token : "",
            userInfo: userInfo ? JSON.parse(userInfo) : JSON.parse("{}"),
            expiresAt: Number(expiresAt)
        }
    }
    return DEFAULT_STATE
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
    // TODO: not sure if the following block is doing the right thing.    
    // ideally this gets called only once to make a call to the server & figure out if the user is loggedin.
    // the useMeQuery() seems to automatically execute the query
    const [{ data, fetching }] = useMeQuery();
    console.log("In provider");
    let state = loadAuthState()
    const [authState, setAuthState] = useState(state)

    useEffect(()=> {
        console.log("In provider:useEffect()", "token=", state.token);
        if (state.token=="" && data?.me && data?.me.tokenInfo) {
            setAuthState({
                token:data?.me.tokenInfo.token,
                userInfo:JSON.parse(data?.me.tokenInfo.userInfo),
                expiresAt: data?.me.tokenInfo.expiresAt
            })
        }
    },[])
    ////

    

    const setAuthInfo = (tokenInfo: Token) => {
        console.log("provider:setting login state", tokenInfo);
        const token = tokenInfo.token;
        const userInfo = JSON.parse(tokenInfo.userInfo as string);
        const expiresAt = tokenInfo.expiresAt;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USERINFO_KEY, JSON.stringify(userInfo));
        localStorage.setItem(EXPIRESAT_KEY, expiresAt.toString());

        setAuthState({ token, userInfo, expiresAt })
    }

    const onLogout = () => {
        console.log("provider: onLogout")
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERINFO_KEY);
        localStorage.removeItem(EXPIRESAT_KEY);
        setAuthState(DEFAULT_STATE);
    }

    const isAuthenticated = (): boolean => {
        if (!authState.token || !authState.expiresAt) {
            return false;
        }
        return (
            new Date().getTime() / 1000 < authState.expiresAt
        );
    }
    const isAdmin = (): boolean => {
        return authState.userInfo["role"] === 'admin';
    } 

    return (
        <AuthContext.Provider value={{
            authState: authState,
            setAuthState: (authInfo: AuthState) => setAuthInfo(authInfo),
            logout: onLogout,
            isAuthenticated: isAuthenticated,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }