import { Classes } from '@blueprintjs/core';
import { FastField, useFormikContext } from 'formik';
import { subtract } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { ReconcileVendorCreditEntriesTable } from './ReconcileVendorCreditEntriesTable';
import { useReconcileVendorCreditContext } from './ReconcileVendorCreditFormProvider';
import type {
  ReconcileVendorCreditFormEntry,
  ReconcileVendorCreditFormValues,
} from './types';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { getEntriesTotal } from '@/containers/Entries/utils';
import { formattedAmount } from '@/utils';

interface EntriesFastFieldRenderProps {
  form: { setFieldValue: (field: string, value: unknown) => void };
  field: { value: ReconcileVendorCreditFormEntry[] };
  meta: { error?: unknown };
}

export function ReconcileVendorCreditFormFields(): React.ReactElement {
  const { vendorCredit } = useReconcileVendorCreditContext();
  const formattedCreditsRemaining = vendorCredit?.formattedCreditsRemaining;

  return (
    <div className={Classes.DIALOG_BODY}>
      <CreditRemainingRoot>
        <T id={'reconcile_vendor_note.dialog.credits_balance'} />

        <CreditRemainingBalance>
          {formattedCreditsRemaining}
        </CreditRemainingBalance>
      </CreditRemainingRoot>

      <FastField name={'entries'}>
        {({
          form: { setFieldValue },
          field: { value },
        }: EntriesFastFieldRenderProps) => (
          <ReconcileVendorCreditEntriesTable
            entries={value}
            errors={undefined}
            onUpdateData={(newEntries: ReconcileVendorCreditFormEntry[]) => {
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
 */
function ReconcileVendorCreditTotalLines(): React.ReactElement {
  const { vendorCredit } = useReconcileVendorCreditContext();
  const creditsRemaining = vendorCredit?.creditsRemaining ?? 0;
  const currencyCode = vendorCredit?.currencyCode;

  const { values } = useFormikContext<ReconcileVendorCreditFormValues>();

  // Calculate the total amount of credit entries.
  const totalAmount = React.useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );

  // Calculate the total amount of credit remaining.
  const remainingCredits = subtract(creditsRemaining, totalAmount);

  return (
    <ReconcileVendorCreditTotalLinesRoot>
      <ReconcileTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={
            <T id={'reconcile_vendor_credit.dialog.total_amount_to_credit'} />
          }
          value={formattedAmount(totalAmount, currencyCode)}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'reconcile_vendor_credit.dialog.remaining_credits'} />}
          value={formattedAmount(remainingCredits, currencyCode)}
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
