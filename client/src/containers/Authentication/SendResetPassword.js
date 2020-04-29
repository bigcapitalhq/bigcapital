import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { Button, InputGroup, Intent, FormGroup } from '@blueprintjs/core';
import { FormattedMessage } from 'react-intl';
import ErrorMessage from 'components/ErrorMessage';
import Icon from 'components/Icon';
import Copyright from './copyright';
import  SendResetPasswordConnect  from 'connectors/SendResetPassword.connect';
import { compose } from 'utils';
import AppToaster from 'components/AppToaster';

function SendResetPassword({ requestSendResetPassword }) {
  const intl = useIntl();

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const history = useHistory();

  // Validation schema.

  const ValidationSchema = Yup.object().shape({
    crediential: Yup.string('')
      .required(intl.formatMessage({ id: 'required' }))
      .email(intl.formatMessage({ id: 'invalid_email_or_phone_numner' })),
  });

  const initialValues = useMemo(
    () => ({
      crediential: '',
    }),
    []
  );

  // Formik validation
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting }) => {
      requestSendResetPassword(values.crediential)
        .then((response) => {
          AppToaster.show({
            message:
              'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
          });
          history.push('/auth/login');
          setSubmitting(false);
        })
        .catch((error) => {
          setSubmitting(false);
        });
    },
  });
  return (
    <div class='reset-form'>
      <Icon
        className={'reset-form__icon-section'}
        icon='bigcapital'
        iconSize={150}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className={'reset-form__label-section'}>
          <h3>You Can't login ?</h3>
          <p>We'll send a recovery link to your email</p>
        </div>
        <div>
          <FormGroup
            label={'Email or Phone Number'}
            intent={
              formik.errors.crediential &&
              formik.touched.crediential &&
              Intent.DANGER
            }
            helperText={<ErrorMessage name={'crediential'} {...formik} />}
          >
            <InputGroup
              intent={
                formik.errors.crediential &&
                formik.touched.crediential &&
                Intent.DANGER
              }
              large={true}
              {...formik.getFieldProps('crediential')}
            />
          </FormGroup>
        </div>
        <div className={'reset-form__floating-section'}>
          <Button
            className={'btn-send'}
            type={'submit'}
            intent={Intent.PRIMARY}
            fill={true}
          >
            {intl.formatMessage({ id: 'Send Reset Password Mail' })}
          </Button>
        </div>
      </form>

      <div class='reset-form__footer-section'>
        <Link to='/auth/login'>
          <FormattedMessage id='Return to log in' />
        </Link>
      </div>
      <Copyright />
    </div>
  );
}

export default compose(SendResetPasswordConnect)(SendResetPassword);
