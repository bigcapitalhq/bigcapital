import { Intent } from '@blueprintjs/core';
import { css } from '@emotion/css';
import { Form, Formik, FormikHelpers } from 'formik';
import { CreditNoteSendMailFormValues } from './_types';
import { CreditNoteSendMailSchema } from './CreditNoteSendMail.schema';
import { useCreditNoteSendMailBoot } from './CreditNoteSendMailBoot';
import { AppToaster } from '@/components';
import { useDrawerContext } from '@/components/Drawer/DrawerProvider';
import { useSendCreditNoteMail } from '@/hooks/query';
import { useDrawerActions } from '@/hooks/state';
import { transformToForm } from '@/utils';

const initialValues: CreditNoteSendMailFormValues = {
  subject: '',
  message: '',
  from: [],
  to: [],
  cc: [],
  bcc: [],
  attachPdf: true,
};

interface CreditNoteSendMailFormProps {
  children: React.ReactNode;
}

export function CreditNoteSendMailForm({
  children,
}: CreditNoteSendMailFormProps) {
  const { mutateAsync: sendCreditNoteMailMutation } = useSendCreditNoteMail();
  const { creditNoteId, creditNoteMailState } = useCreditNoteSendMailBoot();

  const { name } = useDrawerContext();
  const { closeDrawer } = useDrawerActions();

  const _initialValues: CreditNoteSendMailFormValues = {
    ...initialValues,
    ...transformToForm(creditNoteMailState, initialValues),
  };
  const handleSubmit = (
    values: CreditNoteSendMailFormValues,
    { setSubmitting }: FormikHelpers<CreditNoteSendMailFormValues>,
  ) => {
    setSubmitting(true);
    sendCreditNoteMailMutation([creditNoteId, values])
      .then(() => {
        AppToaster.show({
          message: 'The credit note mail has been sent to the customer.',
          intent: Intent.SUCCESS,
        });
        setSubmitting(false);
        closeDrawer(name);
      })
      .catch((error) => {
        setSubmitting(false);
        AppToaster.show({
          message: 'Something went wrong!',
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <Formik
      initialValues={_initialValues}
      validationSchema={CreditNoteSendMailSchema}
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
