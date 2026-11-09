import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  AuthFooterLinks,
  AuthFooterLink,
  AuthInsiderCard,
} from './_components';
import { useAuthMetaBoot } from './AuthMetaBoot';
import { GoogleAuthSection } from './GoogleAuthButton';
import { LoginForm } from './LoginForm';
import {
  LoginSchema,
  transformLoginErrorsToToasts,
  LoginValues,
} from './utils';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster as Toaster, FormattedMessage as T } from '@/components';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';
import { useAuthLogin } from '@/hooks/query';

const initialValues: LoginValues = {
  crediential: '',
  password: '',
  keepLoggedIn: false,
};

/**
 * Login page.
 */
export function Login() {
  const { mutateAsync: loginMutate } = useAuthLogin();
  const { googleEnabled } = useAuthMetaBoot();
  const history = useHistory();
  const location = useLocation();

  // Surface errors coming back from the Google OAuth redirect.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');

    if (!error) return;

    Toaster.show({
      message: intl.get('google_auth_failed'),
      intent: Intent.DANGER,
    });
    history.replace('/auth/login');
  }, [history, location.search]);

  const handleSubmit = (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>,
  ) => {
    loginMutate({
      email: values.crediential,
      password: values.password,
      rememberMe: values.keepLoggedIn,
    }).catch((response: ApiError) => {
      const toastMessages = transformLoginErrorsToToasts(response.data);

      toastMessages.forEach((toastMessage) => {
        Toaster.show(toastMessage);
      });
      setSubmitting(false);
    });
  };

  return (
    <AuthInsider>
      <AuthInsiderCard>
        {googleEnabled && <GoogleAuthSection />}

        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
          component={LoginForm}
        />
      </AuthInsiderCard>

      <LoginFooterLinks />
    </AuthInsider>
  );
}

function LoginFooterLinks() {
  const { signupDisabled } = useAuthMetaBoot();

  return (
    <AuthFooterLinks>
      {!signupDisabled && (
        <AuthFooterLink>
          <T id={'dont_have_an_account'} />{' '}
          <Link to={'/auth/register'}>
            <T id={'sign_up'} />
          </Link>
        </AuthFooterLink>
      )}
      <AuthFooterLink>
        <Link to={'/auth/send_reset_password'}>
          <T id={'forgot_my_password'} />
        </Link>
      </AuthFooterLink>
    </AuthFooterLinks>
  );
}
