import React, { useEffect, useState } from 'react';
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
  Icon,
} from '@blueprintjs/core';
import login from 'store/authentication/authentication.actions';
import {
  hasErrorType,
  isAuthenticated,
} from 'store/authentication/authentication.reducer';
import AuthenticationToaster from 'components/AppToaster';
import t from 'store/types';
import ErrorMessage from 'components/ErrorMessage';
import IconLog from 'components/Icon';
import Copyright from './copyright';

const ERRORS_TYPES = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
};
function Login({ login, errors, clearErrors, hasError }) {
  const intl = useIntl();
  const history = useHistory();
  

  const [shown, setShown] = useState(false);

  // Validation schema.
  const loginValidationSchema = 
  Yup.object().shape({
    crediential: Yup.string()
      .required(intl.formatMessage({ id: 'required' }))
      .email(intl.formatMessage({ id: 'invalid_email_or_phone_numner' })),
    password: Yup.string()
      .required(intl.formatMessage({ id: 'required' }))
      .min(4),
  });

  // Formik validation schema and submit handler.
  const formik = useFormik({
    initialValues: {
      crediential: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      login({
        crediential: values.crediential,
        password: values.password,
      });
    },
  });

  useEffect(() => {
    const toastBuilders = [];
    if (hasError(ERRORS_TYPES.INVALID_DETAILS)) {
      toastBuilders.push({
        message: intl.formatMessage({ id: 'invalid_email_or_phone_numner' }),
        intent: Intent.WARNING,
      });
    }
    if (hasError(ERRORS_TYPES.USER_INACTIVE)) {
      toastBuilders.push({
        message: intl.formatMessage({
          id: 'the_user_has_been_suspended_from_admin',
        }),
        intent: Intent.WARNING,
      });
    }
    toastBuilders.forEach((builder) => {
      AuthenticationToaster.show(builder);
    });
  }, [hasError, intl]);

  // Handle unmount component
  useEffect(() => () => {
    if (errors.length > 0) {
      clearErrors();
    }
  });

  const passwordRevealer = () => {
    setShown(!shown);
  };

  return (
    <div className='login-form'>
      <IconLog
        className={'login-form__icon-section'}
        icon='bigcapital'
        iconSize={150}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className={'login-form__label-section'}>
          <h3>Log in</h3>
          Need a Bigcapital account ?
          <Link to='/auth/register'> Create an account</Link>
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
        <div>
          <FormGroup
            label={'Password'}
            labelInfo={
              <span onClick={() => passwordRevealer()}>
                <Icon icon='eye-open' />
                Show
              </span>
            }
            intent={
              formik.errors.password && formik.touched.password && Intent.DANGER
            }
            helperText={<ErrorMessage name={'password'} {...formik} />}
          >
            <InputGroup
              large={true}
              intent={
                formik.errors.password &&
                formik.touched.password &&
                Intent.DANGER
              }
              type={shown ? 'text' : 'password'}
              {...formik.getFieldProps('password')}
            />
          </FormGroup>
        </div>
        <div className={'login-form__checkbox-section'}>
          <Checkbox>Keep me logged in</Checkbox>
        </div>

        <div className={'login-form__floating-footer-section'}>
          <Button
            className={'btn-login'}
            type={'submit'}
            intent={Intent.PRIMARY}
            fill={true}
            lang={true}
          >
            {intl.formatMessage({ id: 'Log in' })}
          </Button>
        </div>
      </form>
      <Copyright />
    </div>
  );
}

const mapStateToProps = (state) => ({
  hasError: (errorType) => hasErrorType(state, errorType),
  errors: state.authentication.errors,
});

const mapDispatchToProps = (dispatch) => ({
  login: (form) => dispatch(login({ form })),
  clearErrors: () => dispatch({ type: t.LOGIN_CLEAR_ERRORS }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
