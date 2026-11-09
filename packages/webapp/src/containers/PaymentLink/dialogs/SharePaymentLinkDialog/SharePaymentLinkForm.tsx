import { Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import { SharePaymentLinkFormSchema } from './SharePaymentLinkForm.schema';
import { useSharePaymentLink } from './SharePaymentLinkProvider';
import { AppToaster } from '@/components';
import { useDialogContext } from '@/components/Dialog/DialogProvider';
import { useCreatePaymentLink } from '@/hooks/query/payment-link';

interface SharePaymentLinkFormProps {
  children: React.ReactNode;
}

interface SharePaymentLinkFormValues {
  publicity: string;
  expiryDate: string;
  transactionId: string;
  transactionType: string;
}

const initialValues = {
  publicity: 'public',
  expiryDate: moment().add(30, 'days').format('YYYY-MM-DD'),
  transactionId: '',
  transactionType: '',
};

export const SharePaymentLinkForm = ({
  children,
}: SharePaymentLinkFormProps) => {
  const { mutateAsync: generateShareLink } = useCreatePaymentLink();
  const { payload } = useDialogContext();
  const { setUrl } = useSharePaymentLink();

  const transactionId = payload?.transactionId;
  const transactionType = payload?.transactionType;

  const formInitialValues = {
    ...initialValues,
    transactionType,
    transactionId,
  };
  const handleFormSubmit = (
    values: SharePaymentLinkFormValues,
    { setSubmitting }: FormikHelpers<SharePaymentLinkFormValues>,
  ) => {
    setSubmitting(true);
    generateShareLink(values)
      .then((res) => {
        setSubmitting(false);
        setUrl(res.link);
      })
      .catch(() => {
        setSubmitting(false);
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };
  return (
    <Formik<SharePaymentLinkFormValues>
      initialValues={formInitialValues}
      validationSchema={SharePaymentLinkFormSchema}
      onSubmit={handleFormSubmit}
    >
      <Form>{children}</Form>
    </Formik>
  );
};
SharePaymentLinkForm.displayName = 'SharePaymentLinkForm';
