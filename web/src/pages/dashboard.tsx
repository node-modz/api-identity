import { HStack } from "@chakra-ui/react"
import Card from "../components/Card"
import TopNavBar from "../components/TopNavBar"
import SimpleSidebar from "../components/Sidebar"
import { AuthContent } from "../components/identity/AuthInfo"

const Dasboard = () => (
  <>
    <TopNavBar />
    <SimpleSidebar>
      <HStack>
        <Card />
        <Card />
      </HStack>
      <AuthContent />
    </SimpleSidebar>
  </>
)

export default Dasboard