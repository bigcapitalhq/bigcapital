// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
  FFormGroup,
  FInputGroup,
  FSelect,
} from '@/components';
import { useInvoiceAggregatedTaxRates } from './utils';
import { TaxType } from '@/interfaces/TaxRates';
import {
  InvoiceDueAmountFormatted,
  InvoicePaidAmountFormatted,
  InvoiceSubTotalFormatted,
  InvoiceTotalFormatted,
} from './components';
import { Button } from '@blueprintjs/core';

export function InvoiceFormFooterRight() {
  const {
    values: { inclusive_exclusive_tax, currency_code },
  } = useFormikContext();

  const taxEntries = useInvoiceAggregatedTaxRates();

  return (
    <InvoiceTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={
          <>
            {inclusive_exclusive_tax === TaxType.Inclusive
              ? 'Subtotal (Tax Inclusive)'
              : 'Subtotal'}
          </>
        }
        value={<InvoiceSubTotalFormatted />}
      />
      <FFormGroup name={'discount'} label={'Discount'} inline>
        <FInputGroup
          name={'discount'}
          rightElement={
            <FSelect
              name={'discount_type'}
              items={[
                { text: 'USD', value: 'amount' },
                { text: '%', value: 'percentage' },
              ]}
              input={({ text }) => (
                <Button small minimal>
                  {text}
                </Button>
              )}
              filterable={false}
            />
          }
        />
      </FFormGroup>

      <FFormGroup name={'adjustment'} label={'Adjustment'} inline>
        <FInputGroup name={'adjustment'} />
      </FFormGroup>

      {taxEntries.map((tax, index) => (
        <TotalLine
          key={index}
          title={tax.label}
          value={tax.taxAmountFormatted}
          borderStyle={TotalLineBorderStyle.None}
        />
      ))}
      <TotalLine
        title={`Total (${currency_code})`}
        value={<InvoiceTotalFormatted />}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={<T id={'invoice_form.label.payment_amount'} />}
        value={<InvoicePaidAmountFormatted />}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={<T id={'invoice_form.label.due_amount'} />}
        value={<InvoiceDueAmountFormatted />}
        textStyle={TotalLineTextStyle.Bold}
      />
    </InvoiceTotalLines>
  );
}

const InvoiceTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
