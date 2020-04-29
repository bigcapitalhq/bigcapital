import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';
import InviteFormConnect from 'connectors/InviteForm.connect';
import { useParams } from 'react-router-dom';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  HTMLSelect,
  Icon,
} from '@blueprintjs/core';

import { Row, Col } from 'react-grid-system';
import IconLog from 'components/Icon';
import Copyright from './copyright';
import { Link } from 'react-router-dom';

function Invite({ requestSubmitInvite }) {
  const intl = useIntl();
  let params = useParams('accept/:token');

  const { token } = params;

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


  const ValidationSchema = Yup.object().shape({
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone_number: Yup.string().matches(phoneRegExp).required(),
    password: Yup.string()
      .min(4, 'Password has to be longer than 4 characters!')
      .required('Password is required!'),
  });

  const initialValues = useMemo(
    () => ({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      language: '',
      password: '',
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
      requestSubmitInvite(values, token)
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
    <div className={'invite-form'}>
      <IconLog
        className={'invite-form__icon-section'}
        icon='bigcapital'
        iconSize={150}
      />
      <form onSubmit={formik.handleSubmit}>
        <div className={'invite-form__label-section'}>
          <h3>Welcome to Bigcapital</h3>
          <p>
            Enter your personal information <b>{'Organization Name'}</b>{' '}
            Organization.
          </p>
        </div>

        <Row>
          <Col md={6}>
            <FormGroup
              label={'First Name'}
              className={'form-group--first_name'}
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
              className={'form-group--last_name'}
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
            className={'form-group--phone_number'}
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

        {/* <FormGroup
          label={'Email'}
          className={'form-group--email'}
          intent={errors.email && touched.email && Intent.DANGER}
          helperText={<ErrorMessage name={'email'} />}
        >
          <InputGroup
            intent={errors.email && touched.email && Intent.DANGER}
            {...getFieldProps('email')}
          />
        </FormGroup> */}
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

        <div className={'invite-form__statement-section'}>
          <p>
            You email address is <b>{'xxx@gamil.com'},</b> <br />
            You will use this address to sign in to Bigcapital.
          </p>
          <p>
            By signing in or creating an account, you agree with our <br />
            <Link>Terms & Conditions</Link> and <Link> Privacy Statement</Link>
          </p>
        </div>
        <div class='invite-form__floating-footer'>
          <Button
            className={'btn-invite'}
            intent={Intent.PRIMARY}
            type='submit'
          >
            Create Account
          </Button>
        </div>
      </form>
      <Copyright />
    </div>
  );
}

export default compose(InviteFormConnect)(Invite);
