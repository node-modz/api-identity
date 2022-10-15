import { HStack } from "@chakra-ui/react"
import Card from "../../components/accounting/Card"
import * as shell from '../../components/shell'
import { AuthContent } from "../../components/identity/AuthInfo"
import BankActivity from "../../components/accounting/BankActivity"

const Dasboard = () => (
  <>
    <shell.TopNavBar />
    <shell.SimpleSidebar>
      <AuthContent />
      <HStack>
        <Card />
        <Card />
      </HStack>
      <BankActivity />

    </shell.SimpleSidebar>
  </>
)

export default Dasboard