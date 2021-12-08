import React from 'react';
import { FastField, useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';
import { T, TotalLines, TotalLine } from 'components';
import { getEntriesTotal } from 'containers/Entries/utils';
import ReconcileVendorCreditEntriesTable from './ReconcileVendorCreditEntriesTable';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import { formattedAmount } from 'utils';

export default function ReconcileVendorCreditFormFields() {
  const { vendorCredit } = useReconcileVendorCreditContext();

  const { values } = useFormikContext();

  // Calculate the total amount.
  const totalAmount = React.useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );

  return (
    <div className={Classes.DIALOG_BODY}>
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
            value={formattedAmount(totalAmount, vendorCredit.currency_code)}
          />
          <TotalLine
            title={
              <T id={'reconcile_vendor_credit.dialog.remaining_credits'} />
            }
            value={vendorCredit.formatted_credits_remaining}
          />
        </TotalLines>
      </div>
    </div>
  );
}
