import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { MeteredBillingTabs, PaymentMethodTabs } from './SubscriptionTabs';
import withBillingActions from './withBillingActions';
import { compose } from 'utils';

function BillingForm({
  // #withDashboardActions
  changePageTitle,

  //#withBillingActions
  requestSubmitBilling,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'billing' }));
  }, [changePageTitle, formatMessage]);

  const validationSchema = Yup.object().shape({
    plan_slug: Yup.string()
      .required()
      .label(formatMessage({ id: 'plan_slug' })),
    license_code: Yup.string().trim(),
  });

  const initialValues = useMemo(
    () => ({
      plan_slug: 'free',
      license_code: '',
    }),
    [],
  );

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      requestSubmitBilling(values)
        .then((response) => {
          setSubmitting(false);
        })
        .catch((errors) => {
          setSubmitting(false);
        });
    },
  });

  return (
    <div className={'billing-form'}>
      <form onSubmit={formik.handleSubmit}>
        <MeteredBillingTabs formik={formik} planId={formik.values.plan_slug} />
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

export default compose(withDashboardActions, withBillingActions)(BillingForm);
