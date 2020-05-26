import React, { useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';


import { useFormik } from 'formik';
import { FormattedMessage as T, useIntl } from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Checkbox,
} from '@blueprintjs/core';
import Toaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';
import AuthInsider from 'containers/Authentication/AuthInsider';

import Icon from 'components/Icon';
import { If } from 'components';

import withAuthenticationActions from './withAuthenticationActions';

import { compose } from 'utils';


const ERRORS_TYPES = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
};
function Login({
  requestLogin,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const [shown, setShown] = useState(false);
  const passwordRevealer = () => { setShown(!shown); };


  // Validation schema.
  const loginValidationSchema = Yup.object().shape({
    crediential: Yup.string()
      .required()
      .email().label(formatMessage({id:'email'})),
    password: Yup.string()
      .required()
      .min(4).label(formatMessage({id:'password'}))
  });

  // Formik validation schema and submit handler.
  const {
    values,
    touched,
    errors,
    handleSubmit,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    initialValues: {
      crediential: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      requestLogin({
        crediential: values.crediential,
        password: values.password,
      }).then(() => {
        setSubmitting(false);
      }).catch((errors) => {
        const toastBuilders = [];
        if (errors.find((e) => e.type === ERRORS_TYPES.INVALID_DETAILS)) {
          toastBuilders.push({
            message: formatMessage({ id: 'email_and_password_entered_did_not_match' }),
            intent: Intent.DANGER,
          });
        }
        if (errors.find((e) => e.type === ERRORS_TYPES.USER_INACTIVE)) {
          toastBuilders.push({
            message: formatMessage({ id: 'the_user_has_been_suspended_from_admin' }),
            intent: Intent.DANGER,
          });
        }
        toastBuilders.forEach(builder => {
          Toaster.show(builder);
        });
        setSubmitting(false);
      });
    },
  });

  const passwordRevealerTmp = useMemo(() => (
    <span class="password-revealer" onClick={() => passwordRevealer()}>
      <If condition={shown}>
        <><Icon icon='eye-slash' /> <span class="text"><T id={'hide'} /></span></>
      </If>
      <If condition={!shown}>
        <><Icon icon='eye' /> <span class="text"><T id={'show'} /></span></>
      </If>
    </span>), [shown, passwordRevealer]);

  return (
    <AuthInsider>
      <div className='login-form'>
        <div className={'authentication-page__label-section'}>
          <h3><T id={'log_in'} /></h3>
          <T id={'need_bigcapital_account'} />
          <Link to='/auth/register'> <T id={'create_an_account'} /></Link>
        </div>

        <form onSubmit={handleSubmit} className={'authentication-page__form'}>
          <FormGroup
            label={<T id={'email_or_phone_number'} />}
            intent={(errors.crediential && touched.crediential) && Intent.DANGER}
            helperText={<ErrorMessage name={'crediential'} {...{ errors, touched }} />}
            className={'form-group--crediential'}
          >
            <InputGroup
              intent={(errors.crediential && touched.crediential) && Intent.DANGER}
              large={true}
              {...getFieldProps('crediential')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'password'} />}
            labelInfo={passwordRevealerTmp}
            intent={(errors.password && touched.password) && Intent.DANGER}
            helperText={<ErrorMessage name={'password'} {...{ errors, touched }} />}
            className={'form-group--password has-password-revealer'}
          >
            <InputGroup
              large={true}
              intent={(errors.password && touched.password) && Intent.DANGER}
              type={shown ? 'text' : 'password'}
              {...getFieldProps('password')}
            />
          </FormGroup>

          <div className={'login-form__checkbox-section'}>
            <Checkbox
              large={true}
              className={'checkbox--remember-me'}>
              <T id={'keep_me_logged_in'} />
            </Checkbox>
          </div>

          <div className={'authentication-page__submit-button-wrap'}>
            <Button
              type={'submit'}
              intent={Intent.PRIMARY}
              fill={true}
              lang={true}
              loading={isSubmitting}
            >
              <T id={'log_in'} />
            </Button>
          </div>
        </form>

        <div class="authentication-page__footer-links">
          <Link to={'/auth/send_reset_password'}>
            <T id={'forget_my_password'} />
          </Link>
        </div>
      </div>
    </AuthInsider>
  );
}

export default compose(
  withAuthenticationActions,
)(Login);