// @ts-nocheck
import * as Yup from 'yup';
import * as R from 'ramda';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { FormatNumber } from '@/components';
import { usePaymentReceiveFormContext } from '../../PaymentReceiveFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { usePaymentReceivedTotalExceededAmount } from '../../utils';

interface ExcessPaymentValues {}

export function ExcessPaymentDialogContentRoot({ dialogName, closeDialog }) {
  const {
    submitForm,
    values: { currency_code: currencyCode },
  } = useFormikContext();
  const { setIsExcessConfirmed } = usePaymentReceiveFormContext();
  const exceededAmount = usePaymentReceivedTotalExceededAmount();

  const handleSubmit = (
    values: ExcessPaymentValues,
    { setSubmitting }: FormikHelpers<ExcessPaymentValues>,
  ) => {
    setSubmitting(true);
    setIsExcessConfirmed(true);

    submitForm().then(() => {
      closeDialog(dialogName);
      setSubmitting(false);
    });
  };
  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      <Form>
        <ExcessPaymentDialogContentForm
          exceededAmount={
            <FormatNumber value={exceededAmount} currency={currencyCode} />
          }
          onClose={handleClose}
        />
      </Form>
    </Formik>
  );
}

export const ExcessPaymentDialogContent = R.compose(withDialogActions)(
  ExcessPaymentDialogContentRoot,
);

function ExcessPaymentDialogContentForm({ onClose, exceededAmount }) {
  const { submitForm, isSubmitting } = useFormikContext();

  const handleCloseBtn = () => {
    onClose && onClose();
  };

  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <p style={{ marginBottom: 20 }}>
          Would you like to record the excess amount of{' '}
          <strong>{exceededAmount}</strong> as credit payment from the customer.
        </p>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => submitForm()}
          >
            Save Payment as Credit
          </Button>
          <Button onClick={handleCloseBtn}>Cancel</Button>
        </div>
      </div>
    </>
  );
}
