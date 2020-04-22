import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  HTMLSelect,
} from '@blueprintjs/core';

import RegisterFromConnect from 'connectors/RegisterForm.connect';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';

function Register({ requestSubmitRegister }) {
  const intl = useIntl();

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const Country = useMemo(
    () => [
      { value: null, label: 'Select Country' },
      { value: 'libya', label: 'Libya' },
    ],
    []
  );

  const ValidationSchema = Yup.object().shape({
    organization_name: Yup.string().required(
      intl.formatMessage({ id: 'required' })
    ),
    first_name: Yup.string().required(intl.formatMessage({ id: 'required' })),

    last_name: Yup.string().required(intl.formatMessage({ id: 'required' })),
    email: Yup.string()
      .email()
      .required(intl.formatMessage({ id: 'required' })),
    phone_number: Yup.string().matches(phoneRegExp, 'required'),
    password: Yup.string()
      .min(4, 'Password has to be longer than 8 characters!')
      .required('Password is required!'),
    country: Yup.string().required(intl.formatMessage({ id: 'required' })),
  });

  const initialValues = useMemo(
    () => ({
      organization_name: '',
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      country: '',
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

  console.log(formik.values);

  const { errors, values, touched } = useMemo(() => formik, [formik]);
  const requiredSpan = useMemo(() => <span class='required'>*</span>, []);

  return (
    <div className={'register-form'}>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          label={'Organization Name'}
          labelInfo={requiredSpan}
          className={'form-group--name'}
          intent={
            errors.organization_name &&
            touched.organization_name &&
            Intent.DANGER
          }
          helperText={<ErrorMessage name={'organization_name'} {...formik} />}
        >
          <InputGroup
            intent={
              errors.organization_name &&
              touched.organization_name &&
              Intent.DANGER
            }
            {...formik.getFieldProps('organization_name')}
          />
        </FormGroup>

        <FormGroup
          label={'First Name'}
          labelInfo={requiredSpan}
          className={'form-group--first_name'}
          intent={errors.first_name && touched.first_name && Intent.DANGER}
          helperText={<ErrorMessage name={'first_name'} {...formik} />}
        >
          <InputGroup
            intent={errors.first_name && touched.first_name && Intent.DANGER}
            {...formik.getFieldProps('first_name')}
          />
        </FormGroup>
        <FormGroup
          label={'Last Name'}
          labelInfo={requiredSpan}
          className={'form-group--last_name'}
          intent={errors.last_name && touched.last_name && Intent.DANGER}
          helperText={<ErrorMessage name={'last_name'} {...formik} />}
        >
          <InputGroup
            intent={errors.last_name && touched.last_name && Intent.DANGER}
            {...formik.getFieldProps('last_name')}
          />
        </FormGroup>

        <FormGroup
          label={'Country'}
          labelInfo={requiredSpan}
          className={'form-group--country'}
          intent={errors.country && touched.country && Intent.DANGER}
          helperText={<ErrorMessage name={'country'} {...formik} />}
        >
          <HTMLSelect
            fill={true}
            options={Country}
            {...formik.getFieldProps('country')}
          />
        </FormGroup>

        <FormGroup
          label={'Phone Number'}
          labelInfo={requiredSpan}
          className={'form-group--phone_number'}
          intent={errors.phone_number && touched.phone_number && Intent.DANGER}
          helperText={<ErrorMessage name={'phone_number'} {...formik} />}
        >
          <InputGroup
            intent={
              errors.phone_number && touched.phone_number && Intent.DANGER
            }
            {...formik.getFieldProps('phone_number')}
          />
        </FormGroup>
        <FormGroup
          label={'Email'}
          labelInfo={requiredSpan}
          className={'form-group--email'}
          intent={errors.email && touched.email && Intent.DANGER}
          helperText={<ErrorMessage name={'email'} {...formik} />}
        >
          <InputGroup
            intent={errors.last_name && touched.last_name && Intent.DANGER}
            {...formik.getFieldProps('email')}
          />
        </FormGroup>

        <FormGroup
          label={'Password'}
          labelInfo={requiredSpan}
          className={'form-group--password'}
          intent={errors.password && touched.password && Intent.DANGER}
          helperText={<ErrorMessage name={'password'} {...formik} />}
        >
          <InputGroup
            lang={true}
            type={'password'}
            intent={errors.password && touched.password && Intent.DANGER}
            {...formik.getFieldProps('password')}
          />
        </FormGroup>

        <div class='form__floating-footer'>
          <Button intent={Intent.PRIMARY} type='submit'>
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}

export default compose(RegisterFromConnect)(Register);
