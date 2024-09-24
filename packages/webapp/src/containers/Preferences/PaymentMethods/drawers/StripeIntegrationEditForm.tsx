import React from 'react';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { useUpdatePaymentMethod } from '@/hooks/query/payment-services';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { usePaymentMethodsBoot } from '../PreferencesPaymentMethodsBoot';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useStripeIntegrationEditBoot } from './StripeIntegrationEditBoot';
import { transformToForm } from '@/utils';

interface StripeIntegrationFormValues {
  bankAccountId: string;
  clearingAccountId: string;
}
const initialValues = {
  bankAccountId: '',
  clearingAccountId: '',
};
const validationSchema = Yup.object().shape({
  bankAccountId: Yup.string().required('Bank Account is required'),
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
  const { paymentMethod } = useStripeIntegrationEditBoot();
  const stripePaymentState = paymentMethodsState?.stripe;
  const paymentMethodId = stripePaymentState?.stripePaymentMethodId;

  const formInitialValues = {
    ...initialValues,
    ...transformToForm(paymentMethod?.options, initialValues),
  };
  const onSubmit = (
    values: StripeIntegrationFormValues,
    { setSubmitting }: FormikHelpers<StripeIntegrationFormValues>,
  ) => {
    const _values = { options: { ...values } };

    setSubmitting(true);
    updatePaymentMethod({ paymentMethodId, values: _values })
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
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
}
