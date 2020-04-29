import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  HTMLSelect,
  Icon,
} from '@blueprintjs/core';
import RegisterFromConnect from 'connectors/RegisterForm.connect';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';
import { Row, Col } from 'react-grid-system';
import IconLog from 'components/Icon';
import Copyright from './copyright';
import { Link } from 'react-router-dom';
// import { compose, regExpCollection } from 'utils';

function Register({ requestSubmitRegister }) {
  const intl = useIntl();
  const Country = useMemo(
    () => [
      { value: null, label: 'Select Country' },
      { value: 'libya', label: 'Libya' },
    ],
    []
  );

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
    // country: Yup.string().required(intl.formatMessage({ id: 'required' })),
  });

  const initialValues = useMemo(
    () => ({
      organization_name: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      // country: '',
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
      requestSubmitRegister(values)
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

  const [shown, setShown] = useState(false);

  const passwordRevealer = () => {
    setShown(!shown);
  };

  return (
    <div className={'register-form'}>
      <IconLog
        className={'register-form__icon-section'}
        icon='bigcapital'
        iconSize={150}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className={'register-form__label-section'}>
          <h3>
            Register a New <br />
            Organization.
          </h3>
          You have a bigcapital account ?<Link to='/auth/login'> Login</Link>
        </div>
        <div>
          <FormGroup
            label={'Organization Name'}
            className={'form-group--name'}
            intent={
              formik.errors.organization_name &&
              formik.touched.organization_name &&
              Intent.DANGER
            }
            helperText={<ErrorMessage {...formik} name={'organization_name'} />}
          >
            <InputGroup
              intent={
                formik.errors.organization_name &&
                formik.touched.organization_name &&
                formik.Intent.DANGER
              }
              {...formik.getFieldProps('organization_name')}
            />
          </FormGroup>
        </div>
        <Row className={'name-section'}>
          <Col md={6}>
            <FormGroup
              label={'First Name'}
              intent={
                formik.errors.first_name &&
                formik.touched.first_name &&
                Intent.DANGER
              }
              helperText={<ErrorMessage name={'first_name'} {...formik} />}
            >
              <InputGroup
                intent={
                  formik.errors.first_name &&
                  formik.touched.first_name &&
                  Intent.DANGER
                }
                {...formik.getFieldProps('first_name')}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              label={'Last Name'}
              intent={
                formik.errors.last_name &&
                formik.touched.last_name &&
                Intent.DANGER
              }
              helperText={<ErrorMessage name={'last_name'} {...formik} />}
            >
              <InputGroup
                intent={
                  formik.errors.last_name &&
                  formik.touched.last_name &&
                  Intent.DANGER
                }
                {...formik.getFieldProps('last_name')}
              />
            </FormGroup>
          </Col>
        </Row>

        <div>
          <FormGroup
            label={'Phone Number'}
            intent={
              formik.errors.phone_number &&
              formik.touched.phone_number &&
              Intent.DANGER
            }
            helperText={<ErrorMessage name={'phone_number'} {...formik} />}
          >
            <InputGroup
              intent={
                formik.errors.phone_number &&
                formik.touched.phone_number &&
                Intent.DANGER
              }
              {...formik.getFieldProps('phone_number')}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup
            label={'Email'}
            intent={
              formik.errors.email && formik.touched.email && Intent.DANGER
            }
            helperText={<ErrorMessage name={'email'} {...formik} />}
          >
            <InputGroup
              intent={
                formik.errors.email && formik.touched.email && Intent.DANGER
              }
              {...formik.getFieldProps('email')}
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
            className={'form-group--password'}
            intent={
              formik.errors.password && formik.touched.password && Intent.DANGER
            }
            helperText={<ErrorMessage name={'password'} {...formik} />}
          >
            <InputGroup
              lang={true}
              type={shown ? 'text' : 'password'}
              intent={
                formik.errors.password &&
                formik.touched.password &&
                Intent.DANGER
              }
              {...formik.getFieldProps('password')}
            />
          </FormGroup>
        </div>
        <div className={'register-form__statement-section'}>
          <p>
            By signing in or creating an account, you agree with our <br />
            <Link>Terms & Conditions</Link> and <Link> Privacy Statement</Link>
          </p>
        </div>
        <div className={'register-form__floating-footer-section'}>
          <Button
            className={'btn-register'}
            intent={Intent.PRIMARY}
            type='submit'
          >
            Register
          </Button>
        </div>
      </form>
      <Copyright />
    </div>
  );
}

export default compose(RegisterFromConnect)(Register);
