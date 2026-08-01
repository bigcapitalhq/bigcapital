import { Classes } from '@blueprintjs/core';
import { FastField, useFormikContext } from 'formik';
import { subtract } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { ReconcileCreditNoteEntriesTable } from './ReconcileCreditNoteEntriesTable';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import type {
  ReconcileCreditNoteFormEntry,
  ReconcileCreditNoteFormValues,
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
  field: { value: ReconcileCreditNoteFormEntry[] };
  meta: { error?: unknown };
}

/**
 * Reconcile credit note form fields.
 */
export function ReconcileCreditNoteFormFields(): React.ReactElement {
  const { creditNote } = useReconcileCreditNoteContext();
  const formattedCreditsRemaining = creditNote?.formattedCreditsRemaining;

  return (
    <div className={Classes.DIALOG_BODY}>
      <CreditRemainingRoot>
        <T id={'reconcile_credit_note.dialog.credits_balance'} />

        <CreditRemainingBalance>
          {formattedCreditsRemaining}
        </CreditRemainingBalance>
      </CreditRemainingRoot>

      {/*------------ Reconcile credit entries table -----------*/}
      <FastField name={'entries'}>
        {({
          form: { setFieldValue },
          field: { value },
          meta: { error },
        }: EntriesFastFieldRenderProps) => (
          <ReconcileCreditNoteEntriesTable
            entries={value}
            errors={error}
            onUpdateData={(newEntries: ReconcileCreditNoteFormEntry[]) => {
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
 */
function ReconcileCreditNoteTotalLines(): React.ReactElement {
  // Reconcile credit note context.
  const { creditNote } = useReconcileCreditNoteContext();
  const creditsRemaining = creditNote?.creditsRemaining ?? 0;
  const currencyCode = creditNote?.currencyCode;

  // Formik form context.
  const { values } = useFormikContext<ReconcileCreditNoteFormValues>();

  // Calculate the total amount of credit entries.
  const totalAmount = React.useMemo(
    () => getEntriesTotal(values.entries),
    [values.entries],
  );
  // Calculate the total amount of credit remaining.
  const remainingCredits = subtract(creditsRemaining, totalAmount);

  return (
    <ReconcileCreditNoteTotalLinesRoot>
      <ReconcileTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={
            <T id={'reconcile_credit_note.dialog.total_amount_to_credit'} />
          }
          value={formattedAmount(totalAmount, currencyCode)}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'reconcile_credit_note.dialog.remaining_credits'} />}
          value={formattedAmount(remainingCredits, currencyCode)}
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
