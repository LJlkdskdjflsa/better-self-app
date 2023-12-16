'use client';

import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'langflow-chat': any;
    }
  }
}

const ChatWidget = ({
  windowTitle,
  flowId,
  chatInputs,
  chatInputField,
  hostUrl,
  apiKey,
}: {
  windowTitle: string;
  flowId: string;
  chatInputs: any;
  chatInputField: any;
  hostUrl: string;
  apiKey: string;
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box position="fixed" bottom="100" right="100" zIndex="1000">
      <langflow-chat
        window_title={windowTitle}
        flow_id={flowId}
        chat_inputs={chatInputs}
        chat_input_field={chatInputField}
        host_url={hostUrl}
        api_key={apiKey}
      />
    </Box>
  );
};

export default ChatWidget;

