// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Formik } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import { Intent } from '@blueprintjs/core';

import { AppToaster, FormattedMessage as T } from '@/components';
import { useAuthSendResetPassword } from '@/hooks/query';

import SendResetPasswordForm from './SendResetPasswordForm';
import {
  SendResetPasswordSchema,
  transformSendResetPassErrorsToToasts,
} from './utils';

import AuthInsider from '@/containers/Authentication/AuthInsider';

/**
 * Send reset password page.
 */
export default function SendResetPassword({ requestSendResetPassword }) {
  const history = useHistory();

  const { mutateAsync: sendResetPasswordMutate } = useAuthSendResetPassword();

  // Initial values.
  const initialValues = useMemo(
    () => ({
      crediential: '',
    }),
    [],
  );

  // Handle form submitting.
  const handleSubmit = (values, { setSubmitting }) => {
    sendResetPasswordMutate({ email: values.crediential })
      .then((response) => {
        AppToaster.show({
          message: intl.get('check_your_email_for_a_link_to_reset'),
          intent: Intent.SUCCESS,
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
          const toastBuilders = transformSendResetPassErrorsToToasts(errors);

          toastBuilders.forEach((builder) => {
            AppToaster.show(builder);
          });
          setSubmitting(false);
        },
      );
  };

  return (
    <AuthInsider>
      <div className="reset-form">
        <div className={'authentication-page__label-section'}>
          <h3>
            <T id={'you_can_t_login'} />
          </h3>
          <p>
            <T id={'we_ll_send_a_recovery_link_to_your_email'} />
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={SendResetPasswordSchema}
          component={SendResetPasswordForm}
        />
        <div class="authentication-page__footer-links">
          <Link to="/auth/login">
            <T id={'return_to_log_in'} />
          </Link>
        </div>
      </div>
    </AuthInsider>
  );
}
