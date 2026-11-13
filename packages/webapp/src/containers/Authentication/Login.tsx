import { Intent } from '@blueprintjs/core';
import { FormikHelpers } from 'formik';
import React, { useEffect, useReducer } from 'react';
import intl from 'react-intl-universal';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthInsiderCard } from './_components';
import { LoginCredentialsStep } from './login/LoginCredentialsStep';
import { LoginFooterLinks } from './login/LoginFooterLinks';
import { loginReducer, initialLoginState } from './login/loginReducer';
import { MfaFlow } from './login/MfaFlow';
import { normalizeSigninResponse } from './login/normalize';
import { transformLoginErrorsToToasts, LoginValues } from './utils';
import type { AuthSigninResponse } from '@bigcapital/sdk-ts';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster as Toaster } from '@/components';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';
import { useApplyAuthLogin, useAuthLogin } from '@/hooks/query';

/**
 * Login page: credentials, then an optional MFA challenge.
 */
export function Login() {
  const { mutateAsync: loginMutate } = useAuthLogin();
  const applyAuthLogin = useApplyAuthLogin();
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);

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
    })
      .then((data: AuthSigninResponse) => {
        const outcome = normalizeSigninResponse(data);

        if (outcome.kind === 'mfa') {
          dispatch({
            type: 'challenge-received',
            challenge: {
              ...outcome.challenge,
              rememberMe: values.keepLoggedIn,
            },
          });
        } else {
          // `useAuthLogin` already stored the complete sign-in response.
          dispatch({ type: 'signin-complete' });
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

  const handleMfaComplete = (data: AuthSigninResponse) => {
    const rememberMe =
      state.status === 'mfa' ? state.challenge.rememberMe : false;

    applyAuthLogin(data, rememberMe);
    dispatch({ type: 'signin-complete' });
  };

  const handleRestart = () => dispatch({ type: 'restart' });

  return (
    <AuthInsider>
      <AuthInsiderCard>
        {state.status === 'credentials' && (
          <LoginCredentialsStep onSubmit={handleSubmit} />
        )}
        {state.status === 'mfa' && (
          <MfaFlow
            challenge={state.challenge}
            onComplete={handleMfaComplete}
            onRestart={handleRestart}
          />
        )}
      </AuthInsiderCard>

      {state.status === 'credentials' && <LoginFooterLinks />}
    </AuthInsider>
  );
}
