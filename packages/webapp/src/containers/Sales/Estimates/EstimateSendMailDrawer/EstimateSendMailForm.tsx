// @ts-nocheck
import { Form, Formik, FormikHelpers } from 'formik';
import { css } from '@emotion/css';
import { Intent } from '@blueprintjs/core';
import { EstimateSendMailFormValues } from './_interfaces';
import { EstimateSendMailSchema } from './EstimateSendMail.schema';
import { useSendSaleEstimateMail } from '@/hooks/query';
import { AppToaster } from '@/components';
import { useDrawerActions } from '@/hooks/state';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { transformToForm } from '@/utils';
import { useEstimateSendMailBoot } from './EstimateSendMailBoot';

const initialValues: EstimateSendMailFormValues = {
  subject: '',
  message: '',
  to: [],
  cc: [],
  bcc: [],
  attachPdf: true,
};

interface EstimateSendMailFormProps {
  children: React.ReactNode;
}

export function EstimateSendMailForm({ children }: EstimateSendMailFormProps) {
  const { mutateAsync: sendEstimateMail } = useSendSaleEstimateMail();
  const { estimateId, estimateMailState } = useEstimateSendMailBoot();

  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const _initialValues: EstimateSendMailFormValues = {
    ...initialValues,
    ...transformToForm(estimateMailState, initialValues),
  };
  const handleSubmit = (
    values: EstimateSendMailFormValues,
    { setSubmitting }: FormikHelpers<EstimateSendMailFormValues>,
  ) => {
    setSubmitting(true);
    sendEstimateMail([estimateId, values])
      .then(() => {
        AppToaster.show({
          message: 'The invoice mail has been sent to the customer.',
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
      validationSchema={EstimateSendMailSchema}
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
