import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { APP_CONFIG } from '../app/AppConfig';
import { AuthContext } from '../app/AuthContext';

const Settings = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(()=>{
    if ( !authContext.isAuthenticated() ) {
      router.push(APP_CONFIG.identity.login.href);
    }    
  },[])
  return (<>
    <>Hello Settings</>
  </>);
}  

export default Settings