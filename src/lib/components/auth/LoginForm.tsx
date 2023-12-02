import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Container,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // get the email from local storage if it exists
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem('email', email);
    } else {
      // Store the token in session storage for the current session only
      sessionStorage.removeItem('email');
    }

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
        // Redirect to the home page
        router.push('/new-record');

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
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="remember-me" mb="0">
            Remember me
          </FormLabel>
          <Checkbox
            id="remember-me"
            isChecked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">
          Login
        </Button>
      </form>

      <Link href="/register" style={{ marginTop: '20px' }}>
        Do not have an account? Register here
      </Link>
    </Container>
  );
}
