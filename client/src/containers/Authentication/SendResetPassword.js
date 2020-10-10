import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import { Button, InputGroup, Intent, FormGroup } from '@blueprintjs/core';

import { compose } from 'utils';

import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';

import AuthInsider from 'containers/Authentication/AuthInsider';

import withAuthenticationActions from './withAuthenticationActions';

function SendResetPassword({ requestSendResetPassword }) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  // Validation schema.
  const ValidationSchema = Yup.object().shape({
    crediential: Yup.string()
      .required()
      .email().label(formatMessage({ id: 'email' })),
  });

  const initialValues = useMemo(
    () => ({
      crediential: '',
    }),
    []
  );

  // Formik validation
  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting }) => {
      requestSendResetPassword(values.crediential)
        .then((response) => {
          AppToaster.show({
            message: formatMessage({id:'check_your_email_for_a_link_to_reset'}),
            intent: Intent.SUCCESS,
          });
          history.push('/auth/login');
          setSubmitting(false);
        })
        .catch((errors) => {
          if (errors.find((e) => e.type === 'EMAIL.NOT.REGISTERED')) {
            AppToaster.show({
              message: formatMessage({id:'we_couldn_t_find_your_account_with_that_email'}),
              intent: Intent.DANGER,
            });
          }
          setSubmitting(false);
        });
    },
  });

  return (
    <AuthInsider>
      <div className='reset-form'>
        <div className={'authentication-page__label-section'}>
          <h3>
            <T id={'you_can_t_login'} />
          </h3>
          <p>
            <T id={'we_ll_send_a_recovery_link_to_your_email'} />
          </p>
        </div>

        <form onSubmit={handleSubmit} className={'send-reset-password'}>
          <FormGroup
            label={'Email or Phone Number'}
            intent={errors.crediential && touched.crediential && Intent.DANGER}
            helperText={
              <ErrorMessage name={'crediential'} {...{ errors, touched }} />
            }
            className={'form-group--crediential'}
          >
            <InputGroup
              intent={
                errors.crediential && touched.crediential && Intent.DANGER
              }
              large={true}
              {...getFieldProps('crediential')}
            />
          </FormGroup>

          <div className={'authentication-page__submit-button-wrap'}>
            <Button
              type={'submit'}
              intent={Intent.PRIMARY}
              fill={true}
              loading={isSubmitting}
            >
              <T id={'send_reset_password_mail'} />
            </Button>
          </div>
        </form>

        <div class='authentication-page__footer-links'>
          <Link to='/auth/login'>
            <T id={'return_to_log_in'} />
          </Link>
        </div>
      </div>
    </AuthInsider>
  );
}

export default compose(withAuthenticationActions)(SendResetPassword);
