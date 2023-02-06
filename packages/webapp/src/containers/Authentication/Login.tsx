// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { AppToaster as Toaster, FormattedMessage as T } from '@/components';

import AuthInsider from '@/containers/Authentication/AuthInsider';
import { useAuthLogin } from '@/hooks/query';

import LoginForm from './LoginForm';
import { LoginSchema, transformLoginErrorsToToasts } from './utils';

/**
 * Login page.
 */
export default function Login() {
  const { mutateAsync: loginMutate } = useAuthLogin();

  const handleSubmit = (values, { setSubmitting }) => {
    loginMutate({
      crediential: values.crediential,
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
      <div className="login-form">
        <div className={'authentication-page__label-section'}>
          <h3>
            <T id={'log_in'} />
          </h3>
          <T id={'need_bigcapital_account'} />
          <Link to="/auth/register">
            {' '}
            <T id={'create_an_account'} />
          </Link>
        </div>

        <Formik
          initialValues={{
            crediential: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
          component={LoginForm}
        />

        <div class="authentication-page__footer-links">
          <Link to={'/auth/send_reset_password'}>
            <T id={'forget_my_password'} />
          </Link>
        </div>
      </div>
    </AuthInsider>
  );
}
