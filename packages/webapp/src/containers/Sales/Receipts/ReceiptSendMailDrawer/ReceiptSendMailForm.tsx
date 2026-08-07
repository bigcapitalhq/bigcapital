// @ts-nocheck
import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Form, Formik, FormikHelpers } from 'formik';
import { ReceiptSendMailFormValues } from './_types';
import { useReceiptSendMailBoot } from './ReceiptSendMailBoot';
import { ReceiptSendMailFormSchema } from './ReceiptSendMailForm.schema';
import { AppToaster } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useSendSaleReceiptMail } from '@/hooks/query';
import { useDrawerActions } from '@/hooks/state';
import { transformToForm } from '@/utils';

const initialValues: ReceiptSendMailFormValues = {
  subject: '',
  message: '',
  to: [],
  cc: [],
  bcc: [],
  attachPdf: true,
};

interface ReceiptSendMailFormProps {
  children: React.ReactNode;
}

export function ReceiptSendMailForm({ children }: ReceiptSendMailFormProps) {
  const { mutateAsync: sendReceiptMail } = useSendSaleReceiptMail();
  const { receiptId, receiptMailState } = useReceiptSendMailBoot();

  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const _initialValues: ReceiptSendMailFormValues = {
    ...initialValues,
    ...transformToForm(receiptMailState, initialValues),
  };
  const handleSubmit = (
    values: ReceiptSendMailFormValues,
    { setSubmitting }: FormikHelpers<ReceiptSendMailFormValues>,
  ) => {
    setSubmitting(true);
    sendReceiptMail([receiptId, values])
      .then(() => {
        AppToaster.show({
          message: 'The receipt mail has been sent to the customer.',
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        closeDrawer(name);
      })
      .catch((error) => {
        setSubmitting(false);
        AppToaster.show({
          message: 'Something went wrong!',
          intent: Intent.SUCCESS,
        });
      });
  };

  return (
    <Formik
      initialValues={_initialValues}
      validationSchema={ReceiptSendMailFormSchema}
      onSubmit={handleSubmit}
    >
      <Form
        className={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        {children}
      </Form>
    </Formik>
  );
}
