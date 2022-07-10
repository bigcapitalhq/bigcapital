import React, { useMemo } from 'react';
import { Formik } from 'formik';
import { Intent, Position } from '@blueprintjs/core';
import { Link, useParams, useHistory } from 'react-router-dom';
import { AppToaster, FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';

import { useAuthResetPassword } from '@/hooks/query';

import AuthInsider from '@/containers/Authentication/AuthInsider';

import ResetPasswordForm from './ResetPasswordForm';
import { ResetPasswordSchema } from './utils';
/**
 * Reset password page.
 */
export default function ResetPassword() {
  const { token } = useParams();
  const history = useHistory();

  // Authentication reset password.
  const { mutateAsync: authResetPasswordMutate } = useAuthResetPassword();

  // Initial values of the form.
  const initialValues = useMemo(
    () => ({
      password: '',
      confirm_password: '',
    }),
    [],
  );

  // Handle the form submitting.
  const handleSubmit = (values, { setSubmitting }) => {
    authResetPasswordMutate([token, values])
      .then((response) => {
        AppToaster.show({
          message: intl.get('password_successfully_updated'),
          intent: Intent.DANGER,
          position: Position.BOTTOM,
        });
        history.push('/auth/login');
        setSubmitting(false);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          if (errors.find((e) => e.type === 'TOKEN_INVALID')) {
            AppToaster.show({
              message: intl.get('an_unexpected_error_occurred'),
              intent: Intent.DANGER,
              position: Position.BOTTOM,
            });
            history.push('/auth/login');
          }
          setSubmitting(false);
        },
      );
  };

  return (
    <AuthInsider>
      <div className={'submit-np-form'}>
        <div className={'authentication-page__label-section'}>
          <h3>
            <T id={'choose_a_new_password'} />
          </h3>
          <T id={'you_remembered_your_password'} />{' '}
          <Link to="/auth/login">
            <T id={'login'} />
          </Link>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
          component={ResetPasswordForm}
        />
      </div>
    </AuthInsider>
  );
}
