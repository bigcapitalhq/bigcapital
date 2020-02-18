import * as React from "react";
import {Link} from 'react-router-dom';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {connect} from 'react-redux';
import {useIntl} from 'react-intl';
import login from 'store/actions/auth';
import {Button, InputGroup, Intent, FormGroup} from "@blueprintjs/core";

const loginValidationSchema = Yup.object().shape({
  credential: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

function Login({ login }) {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      credential: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      login({
        credential: values.credential,
        password: values.password,
      }).then(() => {

      }).catch((errors) => {

      });
    },
  });

  return (
    <div className="login-page">
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          className={'form-group--email-phone-number'}
          intent={formik.errors.credential && Intent.DANGER}
          helperText={formik.errors.credential && formik.errors.credential}>

          <InputGroup
            leftIcon="user"
            placeholder={intl.formatMessage({'id': 'email_or_phone_number'})}
            large={true}
            
            intent={formik.errors.credential && Intent.DANGER}
            {...formik.getFieldProps('credential')} />
        </FormGroup>

        <FormGroup
          className={'form-group--password'}
          intent={formik.errors.credential && Intent.DANGER}
          helperText={formik.errors.password && formik.errors.password}>

          <InputGroup
            leftIcon="info-sign"
            placeholder={intl.formatMessage({'id': 'password'})}
            large={true}
            intent={formik.errors.credential && Intent.DANGER}
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
        <Link to="/auth/reset_password">
          {intl.formatMessage({'id': 'reset_password '})}
        </Link>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  login: form => dispatch(login({ form })),
});

export default connect(null, mapDispatchToProps)(Login);