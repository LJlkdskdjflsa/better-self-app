import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SigninForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // get the email from local storage if it exists
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    } else {
      // Store the token in session storage for the current session only
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('password');
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('登入失敗');
      }

      const data = await response.json();
      // Use data.data to access the payload
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        // expires_in,
        // token_type,
        // user_type,
        // signup_flow_completed,
      } = data.data;

      if (accessToken) {
        // Store the token in local storage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Display success toast
        toast({
          title: '登入成功',
          description: "You've logged in successfully.",
          status: 'success',
          position: 'top',
          duration: 5000,
          isClosable: true,
        });
        // Redirect to the home page
        router.push('/dashboard');

        // Redirect or other post-login logic
      } else {
        toast({
          title: '登入失敗',
          status: 'error',
          position: 'top',
          duration: 9000,
          isClosable: true,
        });
        throw new Error('Token not found');
      }
    } catch (error) {
      toast({
        title: '登入失敗',
        description: (error as Error).message,
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      centerContent
      border="2px"
      borderColor="gray.200"
      bg="white"
      p={4}
      boxShadow="md"
      mt={200}
    >
      <Text fontSize="2xl" fontWeight="bold">
        登入
      </Text>
      <Box p={5}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired width="300px">
            <Input
              type="text"
              placeholder="帳號"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4} width="300px">
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  h="1.75rem"
                  size="sm"
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label=""
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Flex justifyContent="space-between" alignItems="center" p={5}>
            <Box display="flex" alignItems="center">
              <Checkbox
                id="remember-me"
                isChecked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <FormLabel ml={4} htmlFor="remember-me" mb="0">
                記住密碼
              </FormLabel>
            </Box>
            <Text color="blue.500" mt={2}>
              忘記密碼
            </Text>
          </Flex>

          <Button mt={4} colorScheme="blue" type="submit" w="100%">
            登入
          </Button>
        </form>
      </Box>

      {/* <Link href="/register" style={{ marginTop: '20px' }}>
        Do not have an account? Register here
      </Link> */}
    </Container>
  );
}
