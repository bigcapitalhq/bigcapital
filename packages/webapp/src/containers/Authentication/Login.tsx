import { Formik, FormikHelpers } from 'formik';
import { Link } from 'react-router-dom';
import {
  AuthFooterLinks,
  AuthFooterLink,
  AuthInsiderCard,
} from './_components';
import { useAuthMetaBoot } from './AuthMetaBoot';
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
