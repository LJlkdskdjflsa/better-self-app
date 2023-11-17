import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(redirectUrl = '/') {
  const router = useRouter();
  const pathname = usePathname();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      // If no token, redirect to the login page
      if (pathname !== '/login') {
        router.push('/login');
      }
    } else if (pathname === '/login') {
      // If there is a token and user is on login page, redirect them away
      router.push(redirectUrl);
    }
  }, [pathname, router, token, redirectUrl]);

  return token;
}
