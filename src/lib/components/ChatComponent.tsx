import { Box, useToast } from '@chakra-ui/react';
import type { MessageModel } from '@chatscope/chat-ui-kit-react';
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
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { v4 as uuidv4 } from 'uuid';

import { debug } from './dashboard/utils/logging';

interface CustomMessageModel extends MessageModel {
  id: string;
}

const ChatComponent = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [messages, setMessages] = useState<CustomMessageModel[]>([
    {
      id: uuidv4(),
      message: t('common:initial-message'), // Use t function for translation
      sentTime: 'just now',
      sender: 'ChatGPT',
      direction: 'incoming',
      position: 'normal',
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
      {
        ...newMessage,
        sentTime: 'just now',
        direction: 'outgoing',
        position: 'normal',
      },
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
          {
            ...chatGPTResponse,
            message: content,
            direction: 'incoming',
            position: 'normal',
          },
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
          {t('common:chat-with-ai')} {/* Translate static text */}
          <MainContainer
            style={{ padding: '0', border: 'none', height: '100%' }}
          >
            <ChatContainer style={{ backgroundColor: 'white', padding: '2px' }}>
              <MessageList
                style={{
                  borderRadius: '5px',
                  backgroundColor: '#EDF2F7',
                  maxHeight: '700px',
                  overflowY: 'auto',
                }}
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content={t('common:typing-indicator')} /> // Translate dynamic content
                  ) : null
                }
              >
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    model={{
                      ...message,
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput
                attachButton={false}
                placeholder={t('common:sendMessagePlaceholder')} // Translate placeholders
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
