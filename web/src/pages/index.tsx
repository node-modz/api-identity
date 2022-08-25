
import SimpleSidebar from '../components/Sidebar'
import TopNavBar from '../components/TopNavBar'
import { ChakraContainer } from '../components/sample/ChakraContainer'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../app/urql-bootstrap'


const Index = () => (
  <>
    <TopNavBar />    
    <SimpleSidebar>
      <ChakraContainer/>     
    </SimpleSidebar>         
  </>
)
export default withUrqlClient(createUrqlClient,{ssr:true})(Index)
