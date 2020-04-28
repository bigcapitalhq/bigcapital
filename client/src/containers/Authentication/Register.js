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

function Register({
  requestSubmitRegister,
}) {
  const intl = useIntl();
  const Country = useMemo(() => [
    { value: null, label: 'Select Country' },
    { value: 'libya', label: 'Libya' },
  ], []);

  const ValidationSchema = Yup.object().shape({
    organization_name: Yup.string().required(),
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone_number: Yup.string()
      .required(intl.formatMessage({ id: 'required' })),
    password: Yup.string()
      .min(4, 'Password has to be longer than 8 characters!')
      .required('Password is required!'),
    country: Yup.string().required(intl.formatMessage({ id: 'required' })),
  });

  const initialValues = useMemo(() => ({
    organization_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    country: '',
  }), []);

  const {
    getFieldProps,
    getFieldMeta,
    errors,
    values,
    touched,
    handleSubmit,
  } = useFormik({
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

  return (
    <div className={'register-form'}>
      <form onSubmit={handleSubmit}>
        <FormGroup
          label={'Organization Name'}
          labelInfo={requiredSpan}
          className={'form-group--name'}
          intent={
            (errors.organization_name && touched.organization_name) &&
            Intent.DANGER
          }
          helperText={<ErrorMessage name={'organization_name'} />}
        >
          <InputGroup
            intent={
              (errors.organization_name &&
              touched.organization_name) &&
              Intent.DANGER
            }
            {...getFieldProps('organization_name')}
          />
        </FormGroup>

        <FormGroup
          label={'First Name'}
          labelInfo={requiredSpan}
          className={'form-group--first_name'}
          intent={(errors.first_name && touched.first_name) && Intent.DANGER}
          helperText={<ErrorMessage name={'first_name'} />}
        >
          <InputGroup
            intent={errors.first_name && touched.first_name && Intent.DANGER}
            {...getFieldProps('first_name')}
          />
        </FormGroup>

        <FormGroup
          label={'Last Name'}
          labelInfo={requiredSpan}
          className={'form-group--last_name'}
          intent={errors.last_name && touched.last_name && Intent.DANGER}
          helperText={<ErrorMessage name={'last_name'} />}
        >
          <InputGroup
            intent={errors.last_name && touched.last_name && Intent.DANGER}
            {...getFieldProps('last_name')}
          />
        </FormGroup>

        <FormGroup
          label={'Country'}
          labelInfo={requiredSpan}
          className={'form-group--country'}
          intent={(errors.country && touched.country) && Intent.DANGER}
          helperText={<ErrorMessage name={'country'} />}
        >
          <HTMLSelect
            fill={true}
            options={Country}
            {...getFieldProps('country')}
          />
        </FormGroup>

        <FormGroup
          label={'Phone Number'}
          labelInfo={requiredSpan}
          className={'form-group--phone_number'}
          intent={(errors.phone_number && touched.phone_number) && Intent.DANGER}
          helperText={<ErrorMessage name={'phone_number'}  />}
        >
          <InputGroup
            intent={(errors.phone_number && touched.phone_number) && Intent.DANGER}
            {...getFieldProps('phone_number')}
          />
        </FormGroup>

        <FormGroup
          label={'Email'}
          labelInfo={requiredSpan}
          className={'form-group--email'}
          intent={(errors.email && touched.email) && Intent.DANGER}
          helperText={<ErrorMessage name={'email'} />}
        >
          <InputGroup
            intent={errors.email && touched.email && Intent.DANGER}
            {...getFieldProps('email')}
          />
        </FormGroup>

        <FormGroup
          label={'Password'}
          labelInfo={requiredSpan}
          className={'form-group--password'}
          intent={(errors.password && touched.password) && Intent.DANGER}
          helperText={<ErrorMessage name={'password'} />}
        >
          <InputGroup
            lang={true}
            type={'password'}
            intent={(errors.password && touched.password) && Intent.DANGER}
            {...getFieldProps('password')}
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

export default compose(
  RegisterFromConnect,
)(Register);
