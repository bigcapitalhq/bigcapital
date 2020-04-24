import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  HTMLSelect,
} from '@blueprintjs/core';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';
import SendResetPasswordConnect from 'connectors/ResetPassword.connect';

function ResetPassword({ requestSendResetPassword }) {
  const intl = useIntl();
  const ValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(4, 'Password has to be longer than 4 characters!')
      .required('Password is required!'),

    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const initialValues = useMemo(
    () => ({
      password: '',
      confirm_password: '',
    }),
    []
  );
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting }) => {
      requestSendResetPassword(values.password)
        .then((response) => {
          AppToaster.show({
            message: 'success',
          });
          setSubmitting(false);
        })
        .catch((error) => {
          setSubmitting(false);
        });
    },
  });

  const { errors, values, touched } = useMemo(() => formik, [formik]);
  const requiredSpan = useMemo(() => <span class='required'>*</span>, []);

  return (
    <div className={'sendRestPassword-form'}>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          label={'Password'}
          labelInfo={requiredSpan}
          className={'form-group--password'}
          intent={errors.password && touched.password && Intent.DANGER}
          helperText={<ErrorMessage name={'password'} {...formik} />}
        >
          <InputGroup
            lang={true}
            type={'password'}
            intent={errors.password && touched.password && Intent.DANGER}
            {...formik.getFieldProps('password')}
          />
        </FormGroup>
        <FormGroup
          label={'Confirm Password'}
          labelInfo={requiredSpan}
          className={'form-group--confirm_password'}
          intent={
            errors.confirm_password && touched.confirm_password && Intent.DANGER
          }
          helperText={<ErrorMessage name={'confirm_password'} {...formik} />}
        >
          <InputGroup
            lang={true}
            type={'password'}
            intent={
              errors.confirm_password &&
              touched.confirm_password &&
              Intent.DANGER
            }
            {...formik.getFieldProps('confirm_password')}
          />
        </FormGroup>
        <div class='form__floating-footer'>
          <Button intent={Intent.PRIMARY} type='submit'>
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}

export default compose(SendResetPasswordConnect)(ResetPassword);
