
import SimpleSidebar from '../components/Sidebar'
import TopNavBar from '../components/TopNavBar'
import { ChakraContainer } from '../components/sample/ChakraContainer'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../app/urql-bootstrap'

//TODO: standard toast mechanism to show errors on api calls.
//  : SignIn, Signup, ForgotPassword, ChangePassword
//TODO: accessing a secure page should start auth process
// - /dasboard, /settinngs, /explore etc..
const Index = () => (
  <>
    <TopNavBar />    
    <SimpleSidebar>
      <ChakraContainer/>     
    </SimpleSidebar>         
  </>
)
export default withUrqlClient(createUrqlClient,{ssr:true})(Index)
