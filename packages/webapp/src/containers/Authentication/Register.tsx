// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Intent } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from '@/components';
import AuthInsider from '@/containers/Authentication/AuthInsider';
import { useAuthLogin, useAuthRegister } from '@/hooks/query/authentication';

import RegisterForm from './RegisterForm';
import { RegisterSchema, transformRegisterErrorsToForm, transformRegisterToastMessages } from './utils';
import {
  AuthFooterLinks,
  AuthFooterLink,
  AuthInsiderCard,
} from './_components';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
};

/**
 * Register form.
 */
export default function RegisterUserForm() {
  const { mutateAsync: authLoginMutate } = useAuthLogin();
  const { mutateAsync: authRegisterMutate } = useAuthRegister();

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    authRegisterMutate(values)
      .then((response) => {
        authLoginMutate({
          credential: values.email,
          password: values.password,
        }).catch(
          ({
            response: {
              data: { errors },
            },
          }) => {
            AppToaster.show({
              message: intl.get('something_wentwrong'),
              intent: Intent.SUCCESS,
            });
          },
        );
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          const formErrors = transformRegisterErrorsToForm(errors);
          const toastMessages = transformRegisterToastMessages(errors);

          toastMessages.forEach((toastMessage) => {
            AppToaster.show(toastMessage);
          });
          setErrors(formErrors);
          setSubmitting(false);
        },
      );
  };

  return (
    <AuthInsider>
      <AuthInsiderCard>
        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
          component={RegisterForm}
        />
      </AuthInsiderCard>

      <RegisterFooterLinks />
    </AuthInsider>
  );
}

function RegisterFooterLinks() {
  return (
    <AuthFooterLinks>
      <AuthFooterLink>
        Return to <Link to={'/auth/login'}>Sign In</Link>
      </AuthFooterLink>

      <AuthFooterLink>
        <Link to={'/auth/send_reset_password'}>
          <T id={'forget_my_password'} />
        </Link>
      </AuthFooterLink>
    </AuthFooterLinks>
  );
}
