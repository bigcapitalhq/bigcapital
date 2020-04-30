import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Position,
} from '@blueprintjs/core';
import { Link, useParams, useHistory } from 'react-router-dom';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';
import AuthenticationConnect from 'connectors/Authentication.connect';
import AuthInsider from 'containers/Authentication/AuthInsider';

function ResetPassword({
  requestResetPassword,
}) {
  const intl = useIntl();
  const { token } = useParams();
  const history = useHistory();

  const ValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(4, 'Password has to be longer than 4 characters!')
      .required('Password is required!'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const initialValues = useMemo(() => ({
    password: '',
    confirm_password: '',
  }), []);

  const {
    touched,
    values,
    errors,
    handleSubmit,
    setFieldValue,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting }) => {
      requestResetPassword(values, token)
        .then((response) => {
          AppToaster.show({
            message: 'The password for your account was successfully updated.',
            intent: Intent.DANGER,
            position: Position.BOTTOM,
          });
          history.push('/auth/login');
          setSubmitting(false);
        })
        .catch((errors) => {
          if (errors.find(e => e.type === 'TOKEN_INVALID')) {
            AppToaster.show({
              message: 'An unexpected error occurred',
              intent: Intent.DANGER,
              position: Position.BOTTOM,
            });
            history.push('/auth/login');
          }
          setSubmitting(false);
        });
    },
  });

  return (
    <AuthInsider>
      <div className={'submit-np-form'}>       
        <div className={'authentication-page__label-section'}>
          <h3>Choose a new password</h3>
          You remembered your password ? <Link to='/auth/login'>Login</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <FormGroup
            label={'Password'}
            intent={(errors.password && touched.password) && Intent.DANGER}
            helperText={<ErrorMessage name={'password'} {...{errors, touched}} />}
            className={'form-group--password'}
          >
            <InputGroup
              lang={true}
              type={'password'}
              intent={errors.password && touched.password && Intent.DANGER}
              {...getFieldProps('password')}
            />
          </FormGroup>
        
          <FormGroup
            label={'New Password'}
            labelInfo={'(again):'}
            intent={(errors.confirm_password && touched.confirm_password) && Intent.DANGER}
            helperText={<ErrorMessage name={'confirm_password'} {...{errors, touched}} />}
            className={'form-group--confirm-password'}
          >
            <InputGroup
              lang={true}
              type={'password'}
              intent={(errors.confirm_password && touched.confirm_password) && Intent.DANGER}
              {...getFieldProps('confirm_password')}
            />
          </FormGroup>

          <div className={'authentication-page__submit-button-wrap'}>
            <Button
              fill={true}
              className={'btn-new'}
              intent={Intent.PRIMARY}
              type='submit'
              loading={isSubmitting}>
              Submit new password
            </Button>
          </div>
        </form>
      </div>
    </AuthInsider>
  );
}

export default compose(
  AuthenticationConnect,
)(ResetPassword);
