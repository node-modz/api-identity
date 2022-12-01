import { HStack } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../../app/AuthContext';
import BankActivity from "../../components/accounting/BankActivity";
import Card from "../../components/accounting/Card";
import { AuthContent } from "../../components/identity/AuthInfo";


const Dasboard = () => {
  
  const authContext = useContext(AuthContext);
  const router = useRouter();

  //
  // This works in case of username/password login, where the login state is stored & then redirected to page.
  //
  // This doesn't work on google/signin: cookie gets set
  // but then, by the time this gets called the localStorage isn't populated.
  //
  // This check isn't working in a social google/github signin flow, where a cookie is set
  //   : cookie is set, 
  //   : app redirects to this page.
  //   : Dasbhoard.useEffect() is being called 
  //   :    while localStorage isn't populated yet.
  //   :    which gets populated graphql/me request in AuthContext.useEffect();
  //   : this check at that point will say not authenticated. 
  //   : we will endup with an unauthenticated session.
  //
  // One Solution:
  //   have a standard callback i.e /identity/login/cb
  //    - makes the graphQL call & populates the localStorage
  //    - redirects/pushes to localStorage.get("ldgr.cb.route")  
  //
  // useEffect(()=>{
  //   if ( !authContext.isAuthenticated() ) {
  //     router.push(APP_CONFIG.identity.login.href);
  //   }    
  // },[])

  console.log("In Dashboard: isAuthenticated:", authContext.isAuthenticated());
  // if ( !authContext.isAuthenticated() ) {
  //   router.push(APP_CONFIG.identity.login.href);
  // }

  return (<>
    <AuthContent />
    <HStack>
      <Card />
      <Card />
    </HStack>
    <BankActivity />
  </>);
}

export default Dasboard