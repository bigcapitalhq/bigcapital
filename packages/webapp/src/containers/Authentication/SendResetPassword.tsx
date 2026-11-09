import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import intl from 'react-intl-universal';
import { Link, useHistory } from 'react-router-dom';
import {
  AuthFooterLink,
  AuthFooterLinks,
  AuthInsiderCard,
} from './_components';
import { useAuthMetaBoot } from './AuthMetaBoot';
import { SendResetPasswordForm } from './SendResetPasswordForm';
import {
  SendResetPasswordSchema,
  transformSendResetPassErrorsToToasts,
  SendResetPasswordValues,
} from './utils';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster, FormattedMessage as T } from '@/components';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';
import { useAuthSendResetPassword } from '@/hooks/query';

const initialValues: SendResetPasswordValues = {
  crediential: '',
};

/**
 * Send reset password page.
 */
export function SendResetPassword() {
  const history = useHistory();
  const { mutateAsync: sendResetPasswordMutate } = useAuthSendResetPassword();

  // Handle form submitting.
  const handleSubmit = (
    values: SendResetPasswordValues,
    { setSubmitting }: FormikHelpers<SendResetPasswordValues>,
  ) => {
    sendResetPasswordMutate({ email: values.crediential })
      .then(() => {
        AppToaster.show({
          message: intl.get('check_your_email_for_a_link_to_reset'),
          intent: Intent.SUCCESS,
        });
        history.push('/auth/login');
        setSubmitting(false);
      })
      .catch((response: ApiError) => {
        const toastMessages = transformSendResetPassErrorsToToasts(
          response.data,
        );

        toastMessages.forEach((toastMessage) => {
          AppToaster.show(toastMessage);
        });
        setSubmitting(false);
      });
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
          <T id={'dont_have_an_account'} />{' '}
          <Link to={'/auth/register'}>
            <T id={'sign_up'} />
          </Link>
        </AuthFooterLink>
      )}
      <AuthFooterLink>
        <T id={'return_to'} />{' '}
        <Link to={'/auth/login'}>
          <T id={'sign_in'} />
        </Link>
      </AuthFooterLink>
    </AuthFooterLinks>
  );
}
