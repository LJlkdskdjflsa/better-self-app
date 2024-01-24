'use client';

import SigninForm from '~/lib/components/auth/SigninForm';
import { useAuth } from '~/lib/components/hooks/useAuth';

const Signin = () => {
  useAuth('/');
  return <SigninForm />;
};

export default Signin;
