import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import Container from 'typedi';
import { AuthContext } from '../mfe/identity/components/AuthContext';
import { IdentityConfigOptions } from '../mfe/identity/config/config';

const Settings = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const identityConfig:IdentityConfigOptions = Container.get('IdentityConfigOptions');

  useEffect(()=>{
    if ( !authContext.isAuthenticated() ) {
      router.push(identityConfig.links["login"].href);
    }    
  },[])
  return (<>
    <>Hello Settings</>
  </>);
}  

export default Settings