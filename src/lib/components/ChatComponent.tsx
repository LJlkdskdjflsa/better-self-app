import { Box, useToast } from '@chakra-ui/react';
import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Added import for uuid

import { debug } from './dashboard/utils/logging';

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    {
      id: uuidv4(), // Added UUID to initial message
      message: "Hello, I'm Your HR assistance! Ask me anything!",
      sentTime: 'just now',
      sender: 'ChatGPT',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  async function processMessageToChatGPT(message: { message: string }) {
    const requestBody = {
      message: message.message,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat/dashboard-chats`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')} `,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = `HTTP error! Status: ${response.status}`;
      toast({
        title: 'Get ChatGPT response failed, please try again',
        description: errorText,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      throw new Error(errorText);
    }

    const data = await response.json();
    return {
      choices: [{ message: { content: data } }],
    };
  }

  const handleSendRequest = async (message: string) => {
    const newMessage = {
      id: uuidv4(), // Add a UUID to each message
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, sentTime: 'just now' },
    ]);
    setIsTyping(true);
    try {
      const response = await processMessageToChatGPT({
        message: newMessage.message,
      });
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          id: uuidv4(), // Also add a UUID to the response message
          message: content,
          sender: 'ChatGPT',
          sentTime: 'just now', // Added missing property to match the expected type
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...chatGPTResponse, message: content },
        ]); // Ensured the message property is of type string
      }
    } catch (error: unknown) {
      // Change any to unknown
      if (error instanceof Error) {
        debug(`Error processing message: ${error.message}`);
      } else {
        debug('An unknown error occurred');
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box w="100%" h="100%">
      <div style={{ position: 'relative', height: '90%', width: '100%' }}>
        <Box
          h="100%"
          bg="white"
          p={3}
          pb={8}
          borderRadius="20px"
          boxShadow="0 0 10px 0 rgba(0,0,0,0.1)"
        >
          Chat with AI
          <MainContainer
            style={{ padding: '0', border: 'none', height: '100%' }}
          >
            <ChatContainer style={{ backgroundColor: 'white', padding: '2px' }}>
              <MessageList
                style={{
                  borderRadius: '5px',
                  backgroundColor: '#EDF2F7',
                  maxHeight: '700px', // Set a max-height that fits your layout
                  overflowY: 'auto', // Enable vertical scrolling
                }}
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="ChatGPT is typing" />
                  ) : null
                }
              >
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    model={{
                      ...message,
                      direction: 'outgoing',
                      position: 'single',
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput
                attachButton={false}
                placeholder="Send a Message"
                onSend={handleSendRequest}
              />
            </ChatContainer>
          </MainContainer>
        </Box>
      </div>
    </Box>
  );
};

export default ChatComponent;
