import { useRouter } from 'next/router';
import { UserManager } from 'oidc-client';
import { ReactElement, useEffect, useState } from 'react';
import Container from 'typedi';
import { APP_CONFIG } from '../../app/AppConfig';
import * as shell from '../../components/shell';
import { IdentityConfigOptions } from '../../lib/identity/IdentityConfigOptions';

const SigninCallback = () => {
    const router = useRouter()    
    const [errMsg, setErrorMsg] = useState('');
    const identityConfig:IdentityConfigOptions = Container.get('IdentityConfigOptions');

    useEffect(() => {
        // console.log("local storage", localStorage.length);
        // for (var i = 0; i < localStorage.length; i++) {
        //     console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
        // }
        // localStorage.get(`oidc.${router.query.state}`)
        // console.log("+++++> fetching token");
        const userMgr = new UserManager({ response_mode: "query" })
        userMgr.signinRedirectCallback().then(function () {
            console.log(" ------> token fetched");
            router.push(identityConfig.links["postLogin"].href);
        }).catch(function (e) {
            console.error(e);
            setErrorMsg(e);
            router.push(identityConfig.links["login"].href);
        });
    }, [])


    return (
        <>
            <div> fetching token: using state: {router.query.state} </div>
            {errMsg ? <div className='error'>{errMsg}</div> : <></>}
        </>
    )

}

SigninCallback.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <shell.TopNavBar />
            {page}
        </>
    )
}

export default SigninCallback


