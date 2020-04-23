import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import InviteFormConnect from 'connectors/InviteForm.connect';

import { compose } from 'utils';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  HTMLSelect,
} from '@blueprintjs/core';

function SendInvite({ requestSendInvite }) {
  const intl = useIntl();
  const ValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required(intl.formatMessage({ id: 'required' })),
  });

  const initialValues = useMemo(
    () => ({
      email: '',
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
      requestSendInvite(values)
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
    <div>
      <form onSubmit={formik.handleSubmit}>
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
        <div class='form__floating-footer'>
          <Button intent={Intent.PRIMARY} type='submit'>
            Send Invite
          </Button>
        </div>
      </form>
    </div>
  );
}

export default compose(InviteFormConnect)(SendInvite);
