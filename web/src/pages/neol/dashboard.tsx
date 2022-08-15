import { HStack } from "@chakra-ui/react"
import { NavBar } from "../../components/NavBar"
import Card from "../../components/neol/Card"
import TopNavBar from "../../components/neol/TopNavBar"
import SimpleSidebar from "../../components/neol/Sidebar"

const Dasboard = () => (
    <>
      <TopNavBar />    
      <SimpleSidebar>
        <>Hello Dasboard</>
        <HStack>
        <Card/>
        <Card/>
        </HStack>
      </SimpleSidebar>         
    </>
  )

  export default Dasboard