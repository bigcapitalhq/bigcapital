import React, { useEffect } from "react";
import {Link, useHistory} from 'react-router-dom';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {connect} from 'react-redux';
import {useIntl} from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
} from "@blueprintjs/core";
import login from 'store/authentication/authentication.actions';
import {hasErrorType, isAuthenticated} from 'store/authentication/authentication.reducer';
import AuthenticationToaster from 'components/AppToaster';
import t from 'store/types';

const ERRORS_TYPES = {
  INVALID_DETAILS: 'INVALID_DETAILS',
  USER_INACTIVE: 'USER_INACTIVE',
};
function Login({
  login,
  errors,
  clearErrors,
  hasError,
}) {
  const intl = useIntl();
  const history = useHistory();

  // Validation schema.
  const loginValidationSchema = Yup.object().shape({
    crediential: Yup
      .string()
      .required(intl.formatMessage({'id': 'required'}))
      .email(intl.formatMessage({id: 'invalid_email_or_phone_numner'})),
    password: Yup
      .string()
      .required(intl.formatMessage({id: 'required'}))
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
        message: intl.formatMessage({ id: 'the_user_has_been_suspended_from_admin' }),
        intent: Intent.WARNING,
      });
    }
    toastBuilders.forEach(builder => {
      AuthenticationToaster.show(builder);
    });
  }, [hasError, intl]);

  // Handle unmount component
  useEffect(() => () => {
    if (errors.length > 0) {
      clearErrors();
    }
  });

  return (
    <div className="login-page">
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          className={'form-group--crediential'}
          intent={formik.errors.crediential && Intent.DANGER}
          helperText={formik.errors.crediential && formik.errors.crediential}>

          <InputGroup
            leftIcon="user"
            placeholder={intl.formatMessage({'id': 'email_or_phone_number'})}
            large={true}
            intent={formik.errors.crediential && Intent.DANGER}
            {...formik.getFieldProps('crediential')} />
        </FormGroup>

        <FormGroup
          className={'form-group--password'}
          intent={formik.errors.password && Intent.DANGER}
          helperText={formik.errors.password && formik.errors.password}>

          <InputGroup
            leftIcon="info-sign"
            placeholder={intl.formatMessage({'id': 'password'})}
            large={true}
            intent={formik.errors.password && Intent.DANGER}
            type={"password"}
            {...formik.getFieldProps('password')} />
        </FormGroup>

        <Button
          type="submit"
          fill={true}
          large={true}>
          {intl.formatMessage({'id': 'login '})}
        </Button>
      </form>

      <div className="authentication-page__footer">
        <Link to="/auth/send_reset_password">
          {intl.formatMessage({'id': 'reset_password '})}
        </Link>

        <Link to="/auth/register">
          {intl.formatMessage({'id': 'register '})}
        </Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  hasError: (errorType) => hasErrorType(state, errorType),
  errors: state.authentication.errors,
});

const mapDispatchToProps = (dispatch) => ({
  login: form => dispatch(login({ form })),
  clearErrors: () => dispatch({ type: t.LOGIN_CLEAR_ERRORS }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);