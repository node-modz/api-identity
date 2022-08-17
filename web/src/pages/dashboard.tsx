import { HStack } from "@chakra-ui/react"
import Card from "../components/Card"
import TopNavBar from "../components/TopNavBar"
import SimpleSidebar from "../components/Sidebar"

const Dasboard = () => (
    <>
      <TopNavBar />    
      <SimpleSidebar>
        <HStack>
        <Card/>
        <Card/>
        </HStack>
      </SimpleSidebar>         
    </>
  )

  export default Dasboard