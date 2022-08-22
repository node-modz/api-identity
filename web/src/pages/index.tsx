
import SimpleSidebar from '../components/Sidebar'
import TopNavBar from '../components/TopNavBar'
import { ChakraContainer } from '../components/sample/ChakraContainer'
import { AuthProvider } from '../app/AuthContext'


const Index = () => (
  <>
    <TopNavBar />    
    <SimpleSidebar>
      <ChakraContainer/>     
    </SimpleSidebar>         
  </>
)
export default Index
