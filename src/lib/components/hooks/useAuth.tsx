import { useToast } from '@chakra-ui/react'; // Import useToast from Chakra UI
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(redirectUrl = '/') {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast(); // Initialize the useToast hook
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      // If no token, redirect to the signin page
      if (pathname !== '/signin') {
        toast({
          title: 'Authentication Required.',
          description: 'You need to sign in first!',
          status: 'info',
          duration: 9000,
          isClosable: true,
          position: 'top', // Customize the position as needed
        });
        router.push('/signin');
      }
    } else if (pathname === '/signin') {
      // If there is a token and user is on signin page, redirect them away
      router.push(redirectUrl);
    }
  }, [pathname, router, token, redirectUrl, toast]); // Add toast to the dependency array

  return token;
}
