import { Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AuthFooterLinks,
  AuthFooterLink,
  AuthInsiderCard,
} from './_components';
import { useAuthMetaBoot } from './AuthMetaBoot';
import { LoginForm } from './LoginForm';
import { LoginTwoFactorSetup, LoginTwoFactorVerify } from './LoginTwoFactor';
import {
  LoginSchema,
  transformLoginErrorsToToasts,
  LoginValues,
} from './utils';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';
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
 * The current step of the sign-in: the password, then (with two-factor) a
 * code, or the setup the organization requires.
 */
type LoginStep =
  | { kind: 'password' }
  | { kind: 'verify' | 'setup'; challengeToken: string; rememberMe: boolean };

/**
 * Login page.
 */
export function Login() {
  const { mutateAsync: loginMutate } = useAuthLogin();
  const [step, setStep] = useState<LoginStep>({ kind: 'password' });

  const handleSubmit = (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>,
  ) => {
    loginMutate({
      email: values.crediential,
      password: values.password,
      rememberMe: values.keepLoggedIn,
    })
      .then((data: AuthSigninResponse) => {
        const response = data as AuthSigninResponse & {
          two_factor_required?: boolean;
          two_factor_setup_required?: boolean;
          challenge_token?: string;
        };
        if (response.challenge_token) {
          setStep({
            kind: response.two_factor_setup_required ? 'setup' : 'verify',
            challengeToken: response.challenge_token,
            rememberMe: values.keepLoggedIn,
          });
        }
      })
      .catch((response: ApiError) => {
        const toastMessages = transformLoginErrorsToToasts(response.data);

        toastMessages.forEach((toastMessage) => {
          Toaster.show(toastMessage);
        });
        setSubmitting(false);
      });
  };
  const handleRestart = () => setStep({ kind: 'password' });

  return (
    <AuthInsider>
      <AuthInsiderCard>
        {step.kind === 'verify' && (
          <LoginTwoFactorVerify
            challengeToken={step.challengeToken}
            rememberMe={step.rememberMe}
            onRestart={handleRestart}
          />
        )}
        {step.kind === 'setup' && (
          <LoginTwoFactorSetup
            challengeToken={step.challengeToken}
            rememberMe={step.rememberMe}
            onRestart={handleRestart}
          />
        )}
        {step.kind === 'password' && (
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
            component={LoginForm}
          />
        )}
      </AuthInsiderCard>

      {step.kind === 'password' && <LoginFooterLinks />}
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
