// @ts-nocheck
import * as R from 'ramda';
import * as Yup from 'yup';
import React, { useMemo } from 'react';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { AccountsSelect, FFormGroup, FormatNumber } from '@/components';
import { usePaymentMadeFormContext } from '../../PaymentMadeFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { ACCOUNT_TYPE } from '@/constants';
import { usePaymentMadeExcessAmount } from '../../utils';

interface ExcessPaymentValues {
  accountId: string;
}

const initialValues = {
  accountId: '',
} as ExcessPaymentValues;

const Schema = Yup.object().shape({
  accountId: Yup.number().required(),
});

const DEFAULT_ACCOUNT_SLUG = 'prepaid-expenses';

function ExcessPaymentDialogContentRoot({ dialogName, closeDialog }) {
  const {
    setFieldValue,
    submitForm,
    values: { currency_code: currencyCode },
  } = useFormikContext();
  const { setIsExcessConfirmed } = usePaymentMadeFormContext();

  // Handles the form submitting.
  const handleSubmit = (
    values: ExcessPaymentValues,
    { setSubmitting }: FormikHelpers<ExcessPaymentValues>,
  ) => {
    setFieldValue(values.accountId);
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
  // Retrieves the default excess account id.
  const defaultAccountId = useDefaultExcessPaymentDeposit();

  const excessAmount = usePaymentMadeExcessAmount();

  return (
    <Formik
      initialValues={{
        ...initialValues,
        accountId: defaultAccountId,
      }}
      validationSchema={Schema}
      onSubmit={handleSubmit}
    >
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
  const { accounts } = usePaymentMadeFormContext();

  const handleCloseBtn = () => {
    onClose && onClose();
  };
  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <p style={{ marginBottom: 20 }}>
          Would you like to record the excess amount of{' '}
          <strong>{excessAmount}</strong> as advanced payment from the customer.
        </p>

        <FFormGroup
          name={'accountId'}
          label={'The excessed amount will be deposited in the'}
          helperText={
            'Only other current asset and non current asset accounts will show.'
          }
        >
          <AccountsSelect
            name={'accountId'}
            items={accounts}
            buttonProps={{ small: true }}
            filterByTypes={[
              ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
              ACCOUNT_TYPE.NON_CURRENT_ASSET,
            ]}
          />
        </FFormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            intent={Intent.PRIMARY}
            loading={isSubmitting}
            onClick={() => submitForm()}
          >
            Save Payment
          </Button>
          <Button onClick={handleCloseBtn}>Cancel</Button>
        </div>
      </div>
    </>
  );
}

const useDefaultExcessPaymentDeposit = () => {
  const { accounts } = usePaymentMadeFormContext();
  return useMemo(() => {
    return accounts?.find((a) => a.slug === DEFAULT_ACCOUNT_SLUG)?.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
