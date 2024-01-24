import { useEffect, useState } from 'react';

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const removeToken = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  // const saveToken = (newToken: string) => {
  //   localStorage.setItem('token', newToken);
  //   setToken(newToken);
  // };

  return [token, removeToken];
};
