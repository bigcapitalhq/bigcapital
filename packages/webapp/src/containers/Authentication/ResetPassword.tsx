import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import intl from 'react-intl-universal';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
  AuthFooterLink,
  AuthFooterLinks,
  AuthInsiderCard,
} from './_components';
import { useAuthMetaBoot } from './AuthMetaBoot';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ResetPasswordSchema, ResetPasswordValues } from './utils';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster, FormattedMessage as T } from '@/components';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';
import { useAuthResetPassword } from '@/hooks/query';

const initialValues: ResetPasswordValues = {
  password: '',
  confirm_password: '',
};
/**
 * Reset password page.
 */
export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const history = useHistory();

  // Authentication reset password.
  const { mutateAsync: authResetPasswordMutate } = useAuthResetPassword();

  // Handle the form submitting.
  const handleSubmit = (
    values: ResetPasswordValues,
    { setSubmitting }: FormikHelpers<ResetPasswordValues>,
  ) => {
    authResetPasswordMutate([token, { password: values.password }])
      .then((response) => {
        AppToaster.show({
          message: intl.get('password_successfully_updated'),
          intent: Intent.SUCCESS,
        });
        history.push('/auth/login');
        setSubmitting(false);
      })
      .catch((response: ApiError) => {
        const errors = response.data?.errors as
          | Array<{ type?: string }>
          | undefined;

        if (errors?.find((e) => e.type === 'TOKEN_INVALID')) {
          AppToaster.show({
            message: intl.get('an_unexpected_error_occurred'),
            intent: Intent.DANGER,
          });
          history.push('/auth/login');
        }
        setSubmitting(false);
      });
  };

  return (
    <AuthInsider>
      <AuthInsiderCard>
        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
          component={ResetPasswordForm}
        />
      </AuthInsiderCard>

      <ResetPasswordFooterLinks />
    </AuthInsider>
  );
}

function ResetPasswordFooterLinks() {
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
