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
  AuthFooterLink,
  AuthFooterLinks,
  AuthInsiderCard,
} from './_components';
import {
  SendResetPasswordSchema,
  transformSendResetPassErrorsToToasts,
} from './utils';
import AuthInsider from '@/containers/Authentication/AuthInsider';
import { useAuthMetaBoot } from './AuthMetaBoot';

const initialValues = {
  crediential: '',
};

/**
 * Send reset password page.
 */
export default function SendResetPassword() {
  const history = useHistory();
  const { mutateAsync: sendResetPasswordMutate } = useAuthSendResetPassword();

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
      <AuthInsiderCard>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={SendResetPasswordSchema}
          component={SendResetPasswordForm}
        />
      </AuthInsiderCard>

      <SendResetPasswordFooterLinks />
    </AuthInsider>
  );
}

function SendResetPasswordFooterLinks() {
  const { signupDisabled } = useAuthMetaBoot();

  return (
    <AuthFooterLinks>
      {!signupDisabled && (
        <AuthFooterLink>
          <T id={'dont_have_an_account'} /> <Link to={'/auth/register'}><T id={'sign_up'} /></Link>
        </AuthFooterLink>
      )}
      <AuthFooterLink>
        <T id={'return_to'} /> <Link to={'/auth/login'}><T id={'sign_in'} /></Link>
      </AuthFooterLink>
    </AuthFooterLinks>
  );
}
