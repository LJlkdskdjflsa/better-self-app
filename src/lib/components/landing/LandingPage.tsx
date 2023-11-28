import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';

import { Illustration } from './Illustration';

export default function BetterSelfLandingPage() {
  return (
    <Container maxW="5xl">
      <Stack
        textAlign="center"
        align="center"
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight="110%"
        >
          Unlock Your Productivity{' '}
          <Text as="span" color="blue.400">
            with AI
          </Text>
        </Heading>
        <Text color="gray.500" maxW="3xl">
          Better Self transforms how you track your time and analyze your
          productivity. Customizable data collection – mood, focus, posture,
          location – all in your pocket. Discover patterns and insights with AI
          to truly understand yourself.
        </Text>
        <Stack spacing={6} direction="row">
          <Button
            rounded="full"
            px={6}
            colorScheme="blue"
            bg="blue.400"
            _hover={{ bg: 'blue.500' }}
          >
            <Link href="/new-record" passHref>
              Get started
            </Link>
          </Button>
          {/* <Button rounded="full" px={6}>
            Learn more
          </Button> */}
        </Stack>
        <Flex w="full">
          <Illustration
            height={{ sm: '24rem', lg: '28rem' }}
            mt={{ base: 12, sm: 16 }}
          />
        </Flex>
      </Stack>
    </Container>
  );
}
