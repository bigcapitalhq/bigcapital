import React from 'react';
import { FastField, useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';
import { subtract } from 'lodash';
import { getEntriesTotal } from 'containers/Entries/utils';
import { T, TotalLines, TotalLine } from 'components';
import ReconcileVendorCreditEntriesTable from './ReconcileVendorCreditEntriesTable';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import { formattedAmount } from 'utils';

export default function ReconcileVendorCreditFormFields() {
  const {
    vendorCredit: {
      currency_code,
      credits_remaining,
      formatted_credits_remaining,
    },
  } = useReconcileVendorCreditContext();

  const { values } = useFormikContext();

  // Calculate the total amount of credit entries.
  const totalAmount = React.useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );

  // Calculate the total amount of credit remaining.
  const creditsRemaining = subtract(credits_remaining, totalAmount);

  return (
    <div className={Classes.DIALOG_BODY}>
      <div className="credit-remaining">
        <div className="credit-remaining__label">
          <T id={'reconcile_vendor_note.dialog.credits_balance'} />
        </div>
        <div className="credit-remaining__balance">
          {formatted_credits_remaining}
        </div>
      </div>

      <FastField name={'entries'}>
        {({
          form: { setFieldValue, values },
          field: { value },
          meta: { error, touched },
        }) => (
          <ReconcileVendorCreditEntriesTable
            entries={value}
            errors={error}
            onUpdateData={(newEntries) => {
              setFieldValue('entries', newEntries);
            }}
          />
        )}
      </FastField>
      <div className="footer">
        <TotalLines className="total_lines">
          <TotalLine
            title={
              <T id={'reconcile_vendor_credit.dialog.total_amount_to_credit'} />
            }
            value={formattedAmount(totalAmount, currency_code)}
          />
          <TotalLine
            title={
              <T id={'reconcile_vendor_credit.dialog.remaining_credits'} />
            }
            value={formattedAmount(creditsRemaining, currency_code)}
          />
        </TotalLines>
      </div>
    </div>
  );
}
