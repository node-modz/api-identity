import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem
} from '@chakra-ui/react';
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons';
import { Hero } from './Hero';
import { Container } from './Container';
import { Main } from './Main';
import { DarkModeSwitch } from './DarkModeSwitch';
import { CTA } from './CTA';
import { Footer } from './Footer';

export const ChakraContainer = () => {
  return (
    <Container height="100vh">
      <Hero title="W3 ledgers" />
      <Main>
        <Text color="text">
          Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code> +{' '}
          <Code>TypeScript</Code>.
        </Text>

        <List spacing={3} my={0} color="text">
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <ChakraLink
              isExternal
              href="https://chakra-ui.com"
              flexGrow={1}
              mr={2}
            >
              Chakra UI <LinkIcon />
            </ChakraLink>
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
              Next.js <LinkIcon />
            </ChakraLink>
          </ListItem>
        </List>
      </Main>

      <DarkModeSwitch />
      <Footer>
        <Text>Next ❤️ Chakra</Text>
      </Footer>
      <CTA />
    </Container>
  );
};

export default ChakraContainer