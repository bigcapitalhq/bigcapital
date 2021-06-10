import React, { useMemo  } from 'react';
import { Formik } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import {
  Intent,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';

import { FormattedMessage as T } from 'components';
import AppToaster from 'components/AppToaster';
import AuthInsider from 'containers/Authentication/AuthInsider';
import { useAuthLogin, useAuthRegister } from '../../hooks/query/authentication';

import RegisterForm from './RegisterForm';
import { RegisterSchema, transformRegisterErrorsToForm } from './utils';

/**
 * Register form.
 */
export default function RegisterUserForm() {
  const history = useHistory();

  const { mutateAsync: authLoginMutate }  = useAuthLogin();
  const { mutateAsync: authRegisterMutate }  = useAuthRegister();
 
  const initialValues = useMemo(
    () => ({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      country: 'LY',
    }),
    [],
  );

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    authRegisterMutate(values)
      .then((response) => {
        authLoginMutate({
          crediential: values.email,
          password: values.password,
        })
          .then(() => {
            history.push('/register/subscription');
            setSubmitting(false);
          })
          .catch(({ response: { data: { errors } } }) => {
            AppToaster.show({
              message: intl.get('something_wentwrong'),
              intent: Intent.SUCCESS,
            });
          });
      })
      .catch(({ response: { data: { errors } } }) => {
        const formErrors = transformRegisterErrorsToForm(errors);

        setErrors(formErrors);
        setSubmitting(false);
      });
  };
 
  return (
    <AuthInsider>
      <div className={'register-form'}>
        <div className={'authentication-page__label-section'}>
          <h3>
            <T id={'register_a_new_organization'} />
          </h3>
          <T id={'you_have_a_bigcapital_account'} />
          <Link to="/auth/login">
            <T id={'login'} />
          </Link>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
          component={RegisterForm}
        />
      </div>
    </AuthInsider>
  );
}