
import * as shell from '../components/shell'
import { ChakraContainer } from '../components/sample/ChakraContainer'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../app/urql-bootstrap'

//TODO: standard toast mechanism to show errors on api calls.
//  : SignIn, Signup, ForgotPassword, ChangePassword
//TODO: accessing a secure page should start auth process
// - /dasboard, /settinngs, /explore etc..
const Index = () => (
  <>
    <shell.TopNavBar />    
    <shell.SimpleSidebar>
      <ChakraContainer/>     
    </shell.SimpleSidebar>         
  </>
)
export default withUrqlClient(createUrqlClient,{ssr:true})(Index)
