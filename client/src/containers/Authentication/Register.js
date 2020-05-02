import React, { useMemo, useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Spinner
} from '@blueprintjs/core';
import { Row, Col } from 'react-grid-system';
import { Link, useHistory } from 'react-router-dom';
import AuthenticationConnect from 'connectors/Authentication.connect';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import AuthInsider from 'containers/Authentication/AuthInsider';
import { compose } from 'utils';
import Icon from 'components/Icon';

function Register({
  requestRegister,
}) {
  const intl = useIntl();
  const history = useHistory();
  const [shown, setShown] = useState(false);
  const passwordRevealer = useCallback(() => { setShown(!shown); }, [shown]);

  const ValidationSchema = Yup.object().shape({
    organization_name: Yup.string().required(),
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone_number: Yup.string()
      .matches()
      .required(intl.formatMessage({ id: 'required' })),
    password: Yup.string()
      .min(4, 'Password has to be longer than 8 characters!')
      .required('Password is required!'),
  });

  const initialValues = useMemo(() => ({
    organization_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  }), []);

  const {
    errors,
    touched,
    values,
    setFieldValue,
    handleSubmit,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
      country: 'libya'
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      requestRegister(values)
        .then((response) => {
          AppToaster.show({
            message: 'success',
          });
          setSubmitting(false);
          history.push('/auth/login');
        })
        .catch((errors) => {
          if (errors.some(e => e.type === 'PHONE_NUMBER_EXISTS')) {
            setErrors({
              phone_number: 'The phone number is already used in another account.'
            });
          }
          if (errors.some(e => e.type === 'EMAIL_EXISTS')) {
            setErrors({
              email: 'The email is already used in another account.'
            });
          }
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
      <div className={'register-form'}>
        <div className={'authentication-page__label-section'}>
          <h3>
            Register a New <br />Organization.
          </h3>
          You have a bigcapital account ?<Link to='/auth/login'> Login</Link>
        </div>

        <form onSubmit={handleSubmit} className={'authentication-page__form'}>
          <FormGroup
            label={'Organization Name'}
            className={'form-group--name'}
            intent={(errors.organization_name && touched.organization_name) && Intent.DANGER}
            helperText={<ErrorMessage {...{errors, touched}} name={'organization_name'} />}
          >
            <InputGroup
              intent={(errors.organization_name && touched.organization_name) && Intent.DANGER}
              {...getFieldProps('organization_name')}
            />
          </FormGroup>

          <Row className={'name-section'}>
            <Col md={6}>
              <FormGroup
                label={'First Name'}
                intent={(errors.first_name && touched.first_name) && Intent.DANGER}
                helperText={<ErrorMessage name={'first_name'} {...{errors, touched}} />}
                className={'form-group--first-name'}
              >
                <InputGroup
                  intent={(errors.first_name && touched.first_name) && Intent.DANGER}
                  {...getFieldProps('first_name')}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup
                label={'Last Name'}
                intent={(errors.last_name && touched.last_name) && Intent.DANGER}
                helperText={<ErrorMessage name={'last_name'} {...{errors, touched}} />}
                className={'form-group--last-name'}
              >
                <InputGroup
                  intent={(errors.last_name && touched.last_name) && Intent.DANGER}
                  {...getFieldProps('last_name')}
                />
              </FormGroup>
            </Col>
          </Row>
          
          <FormGroup
            label={'Phone Number'}
            intent={(errors.phone_number && touched.phone_number) && Intent.DANGER}
            helperText={<ErrorMessage name={'phone_number'} {...{errors, touched}} />}
            className={'form-group--phone-number'}
          >
            <InputGroup
              intent={
                (errors.phone_number && touched.phone_number) &&
                Intent.DANGER
              }
              {...getFieldProps('phone_number')}
            />
          </FormGroup>
      
          <FormGroup
            label={'Email'}
            intent={(errors.email && touched.email) && Intent.DANGER}
            helperText={<ErrorMessage name={'email'} {...{errors, touched}} />}
            className={'form-group--email'}
          >
            <InputGroup
              intent={(errors.email && touched.email) && Intent.DANGER}
              {...getFieldProps('email')}
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
              lang={true}
              type={shown ? 'text' : 'password'}
              intent={(errors.password && touched.password) && Intent.DANGER}
              {...getFieldProps('password')}
            />
          </FormGroup>
          
          <div className={'register-form__agreement-section'}>
            <p>
              By signing in or creating an account, you agree with our <br />
              <Link>Terms & Conditions</Link> and <Link> Privacy Statement</Link>
            </p>
          </div>

          <div className={'authentication-page__submit-button-wrap'}>
            <Button
              className={'btn-register'}
              intent={Intent.PRIMARY}
              type='submit'
              fill={true}
              loading={isSubmitting}
            >
              Register
            </Button>
          </div>
        </form>

        { isSubmitting && (
          <div class="authentication-page__loading-overlay">
            <Spinner size={50} />
          </div>
        )}
      </div>
    </AuthInsider>
  );
}

export default compose(
  AuthenticationConnect,
)(Register);
