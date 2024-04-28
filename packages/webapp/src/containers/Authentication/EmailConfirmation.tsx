// @ts-nocheck
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAuthSignUpVerify } from '@/hooks/query';

export default function EmailConfirmation() {
  const { mutateAsync: authSignupVerify } = useAuthSignUpVerify();
  const params = useParams();
  const history = useHistory();

  const token = params.token;
  const email = params.email;

  useEffect(() => {
    if (!token || !email) {
      history.push('register/email_confirmation');
    }
  }, [history, token, email]);

  useEffect(() => {
    authSignupVerify(token, email)
      .then(() => {})
      .catch((error) => {});
  }, [token, email, authSignupVerify]);

  return null;
}
