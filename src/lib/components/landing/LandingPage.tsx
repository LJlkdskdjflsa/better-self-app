import {
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
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
          用 AI 解鎖人才探索的潛能
        </Heading>
        <Text color="gray.500" maxW="3xl">
          開始使用 HR AI，讓你的人才探索更有效率
        </Text>
        <Stack spacing={6} direction="row">
          <Button
            rounded="full"
            px={6}
            colorScheme="blue"
            bg="blue.400"
            _hover={{ bg: 'blue.500' }}
          >
            <Link href="/dashboard" passHref>
              開始使用
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
