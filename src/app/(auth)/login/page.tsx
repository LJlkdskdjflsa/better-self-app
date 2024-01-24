'use client';

import LoginForm from '~/lib/components/auth/LoginForm';
import { useAuth } from '~/lib/components/hooks/useAuth';

const Login = () => {
  useAuth('/');
  return <LoginForm />;
};

export default Login;
