import React, { useEffect, useMemo } from 'react';
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
} from '@blueprintjs/core';

function Invite({ requestSubmitInvite }) {
  const intl = useIntl();
  let params = useParams('accept/:token');

  const { token } = params;

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const language = useMemo(
    () => [
      { value: null, label: 'Select Country' },
      { value: 'Arabic', label: 'Arabic' },
      { value: 'English', label: 'English' },
    ],
    []
  );
  const ValidationSchema = Yup.object().shape({
    first_name: Yup.string().required(intl.formatMessage({ id: 'required' })),

    last_name: Yup.string().required(intl.formatMessage({ id: 'required' })),

    email: Yup.string()
      .email()
      .required(intl.formatMessage({ id: 'required' })),
    phone_number: Yup.string()
      .matches(phoneRegExp)
      .required(intl.formatMessage({ id: 'required' })),
    language: Yup.string().required(
      intl.formatMessage({
        id: 'required',
      })
    ),
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

  const { errors, values, touched } = useMemo(() => formik, [formik]);
  const requiredSpan = useMemo(() => <span class='required'>*</span>, []);

  return (
    <div className={'invite-form'}>
      <form onSubmit={formik.handleSubmit}>
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
          label={'Language'}
          labelInfo={requiredSpan}
          className={'form-group--language'}
          intent={errors.language && touched.language && Intent.DANGER}
          helperText={<ErrorMessage name={'language'} {...formik} />}
        >
          <HTMLSelect
            fill={true}
            options={language}
            {...formik.getFieldProps('language')}
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
            intent={errors.email && touched.email && Intent.DANGER}
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
            Invite
          </Button>
        </div>
      </form>
    </div>
  );
}

export default compose(InviteFormConnect)(Invite);
