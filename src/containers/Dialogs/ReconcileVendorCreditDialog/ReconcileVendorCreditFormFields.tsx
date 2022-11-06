// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { FastField, useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';
import { subtract } from 'lodash';

import { getEntriesTotal } from '@/containers/Entries/utils';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import ReconcileVendorCreditEntriesTable from './ReconcileVendorCreditEntriesTable';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import { formattedAmount } from '@/utils';

export default function ReconcileVendorCreditFormFields() {
  const {
    vendorCredit: { formatted_credits_remaining },
  } = useReconcileVendorCreditContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <CreditRemainingRoot>
        <T id={'reconcile_vendor_note.dialog.credits_balance'} />

        <CreditRemainingBalance>
          {formatted_credits_remaining}
        </CreditRemainingBalance>
      </CreditRemainingRoot>

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

      <ReconcileVendorCreditTotalLines />
    </div>
  );
}

/**
 * Reconcile vendor credit total lines.
 * @returns {React.JSX}
 */
function ReconcileVendorCreditTotalLines() {
  const {
    vendorCredit: { currency_code, credits_remaining },
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
    <ReconcileVendorCreditTotalLinesRoot>
      <ReconcileTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={
            <T id={'reconcile_vendor_credit.dialog.total_amount_to_credit'} />
          }
          value={formattedAmount(totalAmount, currency_code)}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'reconcile_vendor_credit.dialog.remaining_credits'} />}
          value={formattedAmount(creditsRemaining, currency_code)}
          borderStyle={TotalLineBorderStyle.SingleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </ReconcileTotalLines>
    </ReconcileVendorCreditTotalLinesRoot>
  );
}

const CreditRemainingRoot = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 15px;
`;

const CreditRemainingBalance = styled.span`
  font-weight: 600;
  color: #343463;
  margin-left: 5px;
`;

export const ReconcileVendorCreditTotalLinesRoot = styled.div`
  margin-top: 15px;
`;
export const ReconcileTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
