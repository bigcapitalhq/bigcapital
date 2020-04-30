import React, { useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Checkbox,
  Position,
} from '@blueprintjs/core';
import AuthenticationToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';
import AuthInsider from 'containers/Authentication/AuthInsider';
import Icon from 'components/Icon';
import AuthenticationConnect from 'connectors/Authentication.connect';
import { compose } from 'utils';

const ERRORS_TYPES = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
};
function Login({
  requestLogin,
}) {
  const intl = useIntl();
  const history = useHistory();
  const [shown, setShown] = useState(false);
  const passwordRevealer = () => { setShown(!shown); };

  // Validation schema.
  const loginValidationSchema =  Yup.object().shape({
    crediential: Yup.string()
      .required(intl.formatMessage({ id: 'required' }))
      .email(intl.formatMessage({ id: 'invalid_email_or_phone_numner' })),
    password: Yup.string()
      .required(intl.formatMessage({ id: 'required' }))
      .min(4),
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
        history.go('/dashboard/homepage');
        setSubmitting(false);
      }).catch((errors) => {
        const toastBuilders = [];
        if (errors.find((e) => e.type === ERRORS_TYPES.INVALID_DETAILS)) {
          toastBuilders.push({
            message: `The email and password you entered did not match our records.
              Please double-check and try again.`,
            intent: Intent.DANGER,
            position: Position.BOTTOM,
          });
        }
        if (errors.find((e) => e.type === ERRORS_TYPES.USER_INACTIVE)) {
          toastBuilders.push({
            message: intl.formatMessage({ id: 'the_user_has_been_suspended_from_admin' }),
            intent: Intent.DANGER,
          });
        }
        toastBuilders.forEach(builder => {
          AuthenticationToaster.show(builder);
        });
        setSubmitting(false);
      });
    },
  });

  const passwordRevealerTmp = useMemo(() => (
    <span class="password-revealer" onClick={() => passwordRevealer()}>
      {(shown) ? (
        <><Icon icon='eye-slash' /> <span class="text">Hide</span></>
      ) : (
        <><Icon icon='eye' /> <span class="text">Show</span></>
      )} 
    </span>), [shown, passwordRevealer]);

  return (
    <AuthInsider>
      <div className='login-form'>
        <div className={'authentication-page__label-section'}>
          <h3>Log in</h3>
          Need a Bigcapital account ?
          <Link to='/auth/register'> Create an account</Link>
        </div>

        <form onSubmit={handleSubmit} className={'authentication-page__form'}>
          <FormGroup
            label={'Email or Phone Number'}
            intent={(errors.crediential && touched.crediential) && Intent.DANGER}
            helperText={<ErrorMessage name={'crediential'} {...{errors, touched}} />}
            className={'form-group--crediential'}
          >
            <InputGroup
              intent={(errors.crediential && touched.crediential) && Intent.DANGER}
              large={true}
              placeholder={'name@company.com'}
              {...getFieldProps('crediential')}
            />
          </FormGroup>
      
          <FormGroup
            label={'Password'}
            labelInfo={passwordRevealerTmp}
            intent={(errors.password && touched.password) && Intent.DANGER}
            helperText={<ErrorMessage name={'password'} {...{errors, touched}} />}
            className={'form-group--password has-password-revealer'} 
          >
            <InputGroup
              large={true}
              intent={(errors.password && touched.password) && Intent.DANGER}
              type={shown ? 'text' : 'password'}
              placeholder={'password'}
              {...getFieldProps('password')}
            />
          </FormGroup>
        
          <div className={'login-form__checkbox-section'}>
            <Checkbox
              large={true}
              className={'checkbox--remember-me'}>
                Keep me logged in
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
              {intl.formatMessage({ id: 'Log in' })}
            </Button>
          </div>
        </form>
      
        <div class="authentication-page__footer-links">
          <Link to={'/auth/send_reset_password'}>Forget my password</Link>
        </div>
      </div>
    </AuthInsider>
  );
}

export default compose(
  AuthenticationConnect
)(Login);