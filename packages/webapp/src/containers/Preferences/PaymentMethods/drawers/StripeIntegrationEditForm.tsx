import React from 'react';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { useUpdatePaymentMethod } from '@/hooks/query/payment-services';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { usePaymentMethodsBoot } from '../PreferencesPaymentMethodsBoot';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';

interface StripeIntegrationFormValues {
  paymentAccountId: string;
  clearingAccountId: string;
}

const initialValues = {
  paymentAccountId: '',
  clearingAccountId: '',
};

const validationSchema = Yup.object().shape({
  paymentAccountId: Yup.string().required('Payment Account is required'),
  clearingAccountId: Yup.string().required('Clearing Account is required'),
});

interface StripeIntegrationEditFormProps {
  children: React.ReactNode;
}

export function StripeIntegrationEditForm({
  children,
}: StripeIntegrationEditFormProps) {
  const { closeDrawer } = useDrawerActions();
  const { name } = useDrawerContext();
  const { mutateAsync: updatePaymentMethod } = useUpdatePaymentMethod();
  const { paymentMethodsState } = usePaymentMethodsBoot();
  const stripePaymentState = paymentMethodsState?.stripe;
  const paymentMethodId = stripePaymentState?.stripePaymentMethodId;

  const onSubmit = (
    values: StripeIntegrationFormValues,
    { setSubmitting }: FormikHelpers<StripeIntegrationFormValues>,
  ) => {
    setSubmitting(true);
    updatePaymentMethod({ paymentMethodId, values })
      .then(() => {
        AppToaster.show({
          message: 'The Stripe settings have been updated.',
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        closeDrawer(name);
      })
      .catch(() => {
        setSubmitting(false);
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.SUCCESS,
        });
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
}
