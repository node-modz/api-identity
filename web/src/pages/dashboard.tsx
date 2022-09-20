import { HStack } from "@chakra-ui/react"
import Card from "../components/Card"
import TopNavBar from "../components/TopNavBar"
import SimpleSidebar from "../components/Sidebar"
import { AuthContent } from "../components/identity/AuthInfo"
import BankActivity from "../components/BankActivity"

const Dasboard = () => (
  <>
    <TopNavBar />
    <SimpleSidebar>
      <AuthContent />
      <HStack>
        <Card />
        <Card />
      </HStack>
      <BankActivity />

    </SimpleSidebar>
  </>
)

export default Dasboard