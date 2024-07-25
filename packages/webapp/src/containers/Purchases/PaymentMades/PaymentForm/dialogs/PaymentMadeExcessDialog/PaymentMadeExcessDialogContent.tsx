// @ts-nocheck
import * as R from 'ramda';
import React from 'react';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { FormatNumber } from '@/components';
import { usePaymentMadeFormContext } from '../../PaymentMadeFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { usePaymentMadeExcessAmount } from '../../utils';

interface ExcessPaymentValues {}
function ExcessPaymentDialogContentRoot({ dialogName, closeDialog }) {
  const {
    submitForm,
    values: { currency_code: currencyCode },
  } = useFormikContext();
  const { setIsExcessConfirmed } = usePaymentMadeFormContext();

  // Handles the form submitting.
  const handleSubmit = (
    values: ExcessPaymentValues,
    { setSubmitting }: FormikHelpers<ExcessPaymentValues>,
  ) => {
    setSubmitting(true);
    setIsExcessConfirmed(true);

    return submitForm().then(() => {
      setSubmitting(false);
      closeDialog(dialogName);
    });
  };
  // Handle close button click.
  const handleCloseBtn = () => {
    closeDialog(dialogName);
  };
  const excessAmount = usePaymentMadeExcessAmount();

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      <Form>
        <ExcessPaymentDialogContentForm
          excessAmount={
            <FormatNumber value={excessAmount} currency={currencyCode} />
          }
          onClose={handleCloseBtn}
        />
      </Form>
    </Formik>
  );
}

export const ExcessPaymentDialogContent = R.compose(withDialogActions)(
  ExcessPaymentDialogContentRoot,
);

interface ExcessPaymentDialogContentFormProps {
  excessAmount: string | number | React.ReactNode;
  onClose?: () => void;
}

function ExcessPaymentDialogContentForm({
  excessAmount,
  onClose,
}: ExcessPaymentDialogContentFormProps) {
  const { submitForm, isSubmitting } = useFormikContext();

  const handleCloseBtn = () => {
    onClose && onClose();
  };
  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <p style={{ marginBottom: 20 }}>
          Would you like to record the excess amount of{' '}
          <strong>{excessAmount}</strong> as credit payment from the vendor.
        </p>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
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
