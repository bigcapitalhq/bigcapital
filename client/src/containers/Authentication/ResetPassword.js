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
import ResetPasswordConnect from 'connectors/ResetPassword.connect';
import Icon from 'components/Icon';
import Copyright from './copyright';
import { Link } from 'react-router-dom';

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

  const formik= useFormik({
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

  const requiredSpan = useMemo(() => <span class='required'>*</span>, []);

  return (
    <div className={'submit-np-form'}>
      <div>
        <Icon
          className={'submit-np-form__icon-section'}
          icon='bigcapital'
          iconSize={150}
        />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className={'submit-np-form__label-section'}>
          <h3>Choose a new password</h3>
          You remembered your password ? <Link to='/auth/login'>Login</Link>
        </div>
        <div>
          <FormGroup
            label={'Password'}
            intent={formik.errors.password && formik.touched.password && Intent.DANGER}
            helperText={<ErrorMessage name={'password'} {...formik} />}
          >
            <InputGroup
              lang={true}
              type={'password'}
              intent={formik.errors.password && formik.touched.password && Intent.DANGER}
              {...formik.getFieldProps('password')}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup
            label={'New Password'}
            labelInfo={'(again):'}
            intent={
              formik.errors.confirm_password &&
              formik.touched.confirm_password &&
              Intent.DANGER
            }
            helperText={<ErrorMessage name={'confirm_password'} {...formik} />}
          >
            <InputGroup
              lang={true}
              type={'password'}
              intent={
                formik.errors.confirm_password &&
                formik.touched.confirm_password &&
                Intent.DANGER
              }
              {...formik.getFieldProps('confirm_password')}
            />
          </FormGroup>
        </div>

        <div class='submit-np-form__floating-footer-section'>
          <Button className={'btn-new'} intent={Intent.PRIMARY} type='submit'>
            Submit
          </Button>
        </div>
      </form>
      <Copyright />
    </div>
  );
}

export default compose(ResetPasswordConnect)(ResetPassword);
