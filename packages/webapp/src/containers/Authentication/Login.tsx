// @ts-nocheck
import React from 'react';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import { AppToaster as Toaster, FormattedMessage as T } from '@/components';
import AuthInsider from '@/containers/Authentication/AuthInsider';
import { useAuthLogin } from '@/hooks/query';

import LoginForm from './LoginForm';
import { LoginSchema, transformLoginErrorsToToasts } from './utils';
import {
  AuthFooterLinks,
  AuthFooterLink,
  AuthInsiderCard,
} from './_components';
import { useAuthMetaBoot } from './AuthMetaBoot';

const initialValues = {
  credential: '',
  password: '',
  keepLoggedIn: false,
};

/**
 * Login page.
 */
export default function Login() {
  const { mutateAsync: loginMutate } = useAuthLogin();

  const handleSubmit = (values, { setSubmitting }) => {
    loginMutate({
      credential: values.credential,
      password: values.password,
    }).catch(
      ({
        response: {
          data: { errors },
        },
      }) => {
        const toastBuilders = transformLoginErrorsToToasts(errors);

        toastBuilders.forEach((builder) => {
          Toaster.show(builder);
        });
        setSubmitting(false);
      },
    );
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
          Don't have an account? <Link to={'/auth/register'}>Sign up</Link>
        </AuthFooterLink>
      )}
      <AuthFooterLink>
        <Link to={'/auth/send_reset_password'}>
          <T id={'forget_my_password'} />
        </Link>
      </AuthFooterLink>
    </AuthFooterLinks>
  );
}
