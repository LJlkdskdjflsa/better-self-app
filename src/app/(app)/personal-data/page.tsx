'use client';

import { Box, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useToken } from '~/lib/components/hooks/useToken';

const PersonalDataPage = () => {
  const router = useRouter();

  const [removeToken] = useToken();

  return (
    <Box
      // direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Flex as="footer" p={4} justifyContent="left" alignItems="center">
        {/* <ChatWidgetNew /> */}
        {/* <langflow-chat
          window_title="BS test 2"
          flow_id="25a54ee8-6fd4-4014-8fb2-2ef51e5a2d0f"
          chat_inputs='{"input":""}'
          chat_input_field="input"
          host_url="https://langflow-railway-production-d101.up.railway.app"
          api_key="sk-MVTcTJ_hO53vVRFvQZYaI95UfDNvTZai5FBW24KBqSc"
        >
        </langflow-chat> */}
        {/* <ChatWidget
          windowTitle="Chat with me"
          flowId="25a54ee8-6fd4-4014-8fb2-2ef51e5a2d0f"
          chatInputs='{"input":"what do I do yesterday"}'
          chatInputField="input"
          hostUrl="https://langflow-railway-production-d101.up.railway.app"
          apiKey="sk-MVTcTJ_hO53vVRFvQZYaI95UfDNvTZai5FBW24KBqSc"
        /> */}
        <Box>
          Want to be better together.? Join our !!!
          <Link href="https://line.me/ti/g/uSNjiBPvW_" color="teal.500">
            Better Group (Line)
          </Link>
        </Box>
      </Flex>
      <Button
        colorScheme="red"
        mt={4} // Margin top for spacing
        onClick={() => {
          if (typeof removeToken === 'function') {
            removeToken();
          }
          router.push('/login');
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default PersonalDataPage;
