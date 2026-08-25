import { Intent } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import {
  AuthFooterLinks,
  AuthFooterLink,
  AuthInsiderCard,
} from './_components';
import { RegisterForm } from './RegisterForm';
import {
  RegisterSchema,
  RegisterValues,
  transformRegisterErrorsToForm,
  transformRegisterToastMessages,
} from './utils';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster, FormattedMessage as T } from '@/components';
import { AuthInsider } from '@/containers/Authentication/AuthInsider';
import { useAuthLogin, useAuthRegister } from '@/hooks/query/authentication';

const initialValues: RegisterValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
};

/**
 * Register form.
 */
export function RegisterUserForm() {
  const { mutateAsync: authLoginMutate } = useAuthLogin();
  const { mutateAsync: authRegisterMutate } = useAuthRegister();

  const handleSubmit = (
    values: RegisterValues,
    { setSubmitting, setErrors }: FormikHelpers<RegisterValues>,
  ) => {
    authRegisterMutate({
      firstName: values.first_name,
      lastName: values.last_name,
      email: values.email,
      password: values.password,
    })
      .then(() => {
        authLoginMutate({
          email: values.email,
          password: values.password,
        }).catch(() => {
          AppToaster.show({
            message: intl.get('something_wentwrong'),
            intent: Intent.SUCCESS,
          });
        });
      })
      .catch((response: ApiError) => {
        const errors =
          (response.data?.errors as Array<{ type?: string }> | undefined) ?? [];

        const formErrors = transformRegisterErrorsToForm(errors);
        const toastMessages = transformRegisterToastMessages(errors);

        toastMessages.forEach((toastMessage) => {
          AppToaster.show(toastMessage);
        });
        setErrors(formErrors);
        setSubmitting(false);
      });
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
        <T id={'return_to'} />{' '}
        <Link to={'/auth/login'}>
          <T id={'sign_in'} />
        </Link>
      </AuthFooterLink>

      <AuthFooterLink>
        <Link to={'/auth/send_reset_password'}>
          <T id={'forgot_my_password'} />
        </Link>
      </AuthFooterLink>
    </AuthFooterLinks>
  );
}
