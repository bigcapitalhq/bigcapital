// @ts-nocheck
import { useMemo } from 'react';
import * as Yup from 'yup';
import * as R from 'ramda';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { AccountsSelect, FFormGroup } from '@/components';
import { usePaymentReceiveFormContext } from '../../PaymentReceiveFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { usePaymentReceivedTotalExceededAmount } from '../../utils';

interface ExcessPaymentValues {
  accountId: string;
}

const initialValues = {
  accountId: '',
} as ExcessPaymentValues;

const Schema = Yup.object().shape({
  accountId: Yup.number().required(),
});

const DEFAULT_ACCOUNT_SLUG = 'depreciation-expense';

export function ExcessPaymentDialogContentRoot({ dialogName, closeDialog }) {
  const { setFieldValue, submitForm } = useFormikContext();
  const { setIsExcessConfirmed } = usePaymentReceiveFormContext();
  const initialAccountId = useDefaultExcessPaymentDeposit();
  const exceededAmount = usePaymentReceivedTotalExceededAmount();

  const handleSubmit = (
    values: ExcessPaymentValues,
    { setSubmitting }: FormikHelpers<ExcessPaymentValues>,
  ) => {
    setSubmitting(true);
    setIsExcessConfirmed(true);
    setFieldValue('unearned_revenue_account_id', values.accountId);

    submitForm().then(() => {
      closeDialog(dialogName);
      setSubmitting(false);
    });
  };
  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        accountId: initialAccountId,
      }}
      validationSchema={Schema}
      onSubmit={handleSubmit}
    >
      <Form>
        <ExcessPaymentDialogContentForm
          exceededAmount={exceededAmount}
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
  const { accounts } = usePaymentReceiveFormContext();
  const { submitForm, isSubmitting } = useFormikContext();

  const handleCloseBtn = () => {
    onClose && onClose();
  };

  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <p>
          Would you like to record the excess amount of{' '}
          <strong>{exceededAmount}</strong> as advanced payment from the
          customer.
        </p>

        <FFormGroup
          name={'accountId'}
          label={'The excessed amount will be deposited in the'}
        >
          <AccountsSelect
            name={'accountId'}
            items={accounts}
            buttonProps={{ small: true }}
          />
        </FFormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => submitForm()}
          >
            Continue to Payment
          </Button>
          <Button onClick={handleCloseBtn}>Cancel</Button>
        </div>
      </div>
    </>
  );
}

const useDefaultExcessPaymentDeposit = () => {
  const { accounts } = usePaymentReceiveFormContext();
  return useMemo(() => {
    return accounts?.find((a) => a.slug === DEFAULT_ACCOUNT_SLUG)?.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
