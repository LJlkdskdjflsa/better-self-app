import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Container,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      toast({
        title: 'Login Successful',
        description: "You've logged in successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirect to the home page
      router.push('/');

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Assuming the token is in the 'token' field of the response
      const token = data.access_token;
      if (token) {
        // Store the token in local storage
        localStorage.setItem('token', token);

        // Display success toast
        toast({
          title: 'Login Successful',
          description: "You've logged in successfully.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Redirect or other post-login logic
      } else {
        toast({
          title: 'Login Failed',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        throw new Error('Token not found');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: (error as Error).message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">
          Login
        </Button>
      </form>
    </Container>
  );
}
