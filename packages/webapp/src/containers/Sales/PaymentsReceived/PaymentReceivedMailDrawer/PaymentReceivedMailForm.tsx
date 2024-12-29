import { Form, Formik, FormikHelpers } from 'formik';
import { css } from '@emotion/css';
import { Intent } from '@blueprintjs/core';
import { PaymentReceivedSendMailFormSchema } from './_types';
import { AppToaster } from '@/components';
import { useSendPaymentReceiveMail, } from '@/hooks/query';
import { usePaymentReceivedSendMailBoot } from './PaymentReceivedMailBoot';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { transformToForm } from '@/utils';
import { PaymentReceivedSendMailFormValues } from './_types';

const initialValues: PaymentReceivedSendMailFormValues = {
  subject: '',
  message: '',
  to: [],
  cc: [],
  bcc: [],
  from: [],
  attachPdf: true,
};

interface PaymentReceivedSendMailFormProps {
  children: React.ReactNode;
}

export function PaymentReceivedSendMailForm({
  children,
}: PaymentReceivedSendMailFormProps) {
  const { mutateAsync: sendPaymentMail } = useSendPaymentReceiveMail();
  const { paymentReceivedId, paymentReceivedMailState } =
    usePaymentReceivedSendMailBoot();

  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const _initialValues: PaymentReceivedSendMailFormValues = {
    ...initialValues,
    ...transformToForm(paymentReceivedMailState, initialValues),
  };
  const handleSubmit = (
    values: PaymentReceivedSendMailFormValues,
    { setSubmitting }: FormikHelpers<PaymentReceivedSendMailFormValues>,
  ) => {
    setSubmitting(true);
    sendPaymentMail([paymentReceivedId, values])
      .then(() => {
        AppToaster.show({
          message: 'The invoice mail has been sent to the customer.',
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        closeDrawer(name);
      })
      .catch(() => {
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
      validationSchema={PaymentReceivedSendMailFormSchema}
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
