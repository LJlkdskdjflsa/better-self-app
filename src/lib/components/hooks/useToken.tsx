import { useState, useEffect } from 'react';

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // const saveToken = (newToken: string) => {
  //   localStorage.setItem('token', newToken);
  //   setToken(newToken);
  // };

  return [token, removeToken];
};
