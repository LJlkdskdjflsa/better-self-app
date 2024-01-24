import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(redirectUrl = '/') {
  const router = useRouter();
  const pathname = usePathname();
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      // If no token, redirect to the signin page
      if (pathname !== '/signin') {
        router.push('/signin');
      }
    } else if (pathname === '/signin') {
      // If there is a token and user is on signin page, redirect them away
      router.push(redirectUrl);
    }
  }, [pathname, router, token, redirectUrl]);

  return token;
}
