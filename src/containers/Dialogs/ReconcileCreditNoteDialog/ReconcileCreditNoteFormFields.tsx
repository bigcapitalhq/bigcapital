// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { FastField, useFormikContext } from 'formik';
import { Classes } from '@blueprintjs/core';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { subtract } from 'lodash';
import { getEntriesTotal } from '@/containers/Entries/utils';
import ReconcileCreditNoteEntriesTable from './ReconcileCreditNoteEntriesTable';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import { formattedAmount } from '@/utils';

/**
 * Reconcile credit note form fields.
 */
export default function ReconcileCreditNoteFormFields() {
  const {
    creditNote: { formatted_credits_remaining },
  } = useReconcileCreditNoteContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <CreditRemainingRoot>
        <T id={'reconcile_credit_note.dialog.credits_balance'} />

        <CreditRemainingBalance>
          {formatted_credits_remaining}
        </CreditRemainingBalance>
      </CreditRemainingRoot>

      {/*------------ Reconcile credit entries table -----------*/}
      <FastField name={'entries'}>
        {({ form: { setFieldValue }, field: { value }, meta: { error } }) => (
          <ReconcileCreditNoteEntriesTable
            entries={value}
            errors={error}
            onUpdateData={(newEntries) => {
              setFieldValue('entries', newEntries);
            }}
          />
        )}
      </FastField>

      <ReconcileCreditNoteTotalLines />
    </div>
  );
}

/**
 * Reconcile credit note total lines.
 * @returns {React.JSX}
 */
function ReconcileCreditNoteTotalLines() {
  // Reconcile credit note context.
  const {
    creditNote: { credits_remaining, currency_code },
  } = useReconcileCreditNoteContext();

  // Formik form context.
  const { values } = useFormikContext();

  // Calculate the total amount of credit entries.
  const totalAmount = React.useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );
  // Calculate the total amount of credit remaining.
  const creditsRemaining = subtract(credits_remaining, totalAmount);

  return (
    <ReconcileCreditNoteTotalLinesRoot>
      <ReconcileTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={
            <T id={'reconcile_credit_note.dialog.total_amount_to_credit'} />
          }
          value={formattedAmount(totalAmount, currency_code)}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'reconcile_credit_note.dialog.remaining_credits'} />}
          value={formattedAmount(creditsRemaining, currency_code)}
          borderStyle={TotalLineBorderStyle.SingleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </ReconcileTotalLines>
    </ReconcileCreditNoteTotalLinesRoot>
  );
}

export const CreditRemainingRoot = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 15px;
`;

export const CreditRemainingBalance = styled.span`
  font-weight: 600;
  color: #343463;
  margin-left: 5px;
`;

export const ReconcileCreditNoteTotalLinesRoot = styled.div`
  margin-top: 15px;
`;

export const ReconcileTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
