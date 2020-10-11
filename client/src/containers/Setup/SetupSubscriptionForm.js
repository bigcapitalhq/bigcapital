import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { Button, Intent } from '@blueprintjs/core';
import BillingTab from 'containers/Subscriptions/BillingTab';

export default function SetupSubscriptionForm({

}) {
  const ValidationSchema = Yup.object().shape({});

  const initialValues = useMemo(() => ({}), []);

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {},
  });
  return (
    <div className={'register-subscription-form'}>
      <form className={'billing-form'}>
        <BillingTab formik={formik} />

        <div className={'subscribe-button'}>
          <Button
            intent={Intent.PRIMARY}
            type="submit"
            loading={formik.isSubmitting}
          >
            <T id={'subscribe'} />
          </Button>
        </div>
      </form>
    </div>
  );
}
