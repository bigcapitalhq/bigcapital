import { x } from '@xstyled/emotion';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getRecurringInvoiceTotals } from './utils';
import type { RecurringInvoiceFormValues } from './utils';
import {
  Col,
  FEditableText,
  FFormGroup,
  FInputGroup,
  FSelect,
  Paper,
  Row,
  Stack,
  T,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
  TotalLines,
} from '@/components';
import { formattedAmount } from '@/utils';

const DISCOUNT_TYPE_OPTIONS = [
  { key: 'amount', label: 'Amount' },
  { key: 'percentage', label: 'Percentage' },
];

export function RecurringInvoiceFormFooter() {
  const { values } = useFormikContext<RecurringInvoiceFormValues>();
  const totals = getRecurringInvoiceTotals(values);

  return (
    <x.div mt={'20px'} px={'32px'} pb={'20px'} flex={1}>
      <Paper p={'20px'}>
        <Row>
          <Col md={8}>
            <Stack spacing={20}>
              <FFormGroup
                name={'invoiceMessage'}
                label={intl.get('invoice_message')}
                fastField
              >
                <FEditableText
                  name={'invoiceMessage'}
                  placeholder={intl.get(
                    'recurring_invoice.field.invoice_message_placeholder',
                  )}
                  multiline
                  fastField
                />
              </FFormGroup>

              <FFormGroup
                name={'termsConditions'}
                label={intl.get('invoice_form.label.terms_conditions')}
                fastField
              >
                <FEditableText
                  name={'termsConditions'}
                  placeholder={intl.get(
                    'recurring_invoice.field.terms_conditions_placeholder',
                  )}
                  multiline
                  fastField
                />
              </FFormGroup>

              {values.deliveryMode === 'email' && (
                <FFormGroup
                  name={'emailMessage'}
                  label={intl.get('recurring_invoice.field.email_message')}
                  fastField
                >
                  <FEditableText
                    name={'emailMessage'}
                    placeholder={intl.get(
                      'recurring_invoice.field.email_message_placeholder',
                    )}
                    multiline
                    fastField
                  />
                </FFormGroup>
              )}
            </Stack>
          </Col>

          <Col md={4}>
            <Stack spacing={10}>
              <FFormGroup
                name={'discount'}
                label={intl.get('discount')}
                inline
                fastField
              >
                <div style={{ display: 'flex', gap: 8 }}>
                  <FInputGroup name={'discount'} type="number" min={0} />
                  <FSelect
                    name={'discountType'}
                    items={DISCOUNT_TYPE_OPTIONS}
                    valueAccessor={'key'}
                    textAccessor={'label'}
                    popoverProps={{ minimal: true }}
                    buttonProps={{ small: true }}
                  />
                </div>
              </FFormGroup>

              <FFormGroup
                name={'adjustment'}
                label={intl.get('adjustment')}
                inline
                fastField
              >
                <FInputGroup name={'adjustment'} type="number" />
              </FFormGroup>

              <TotalsLines>
                <TotalLine
                  title={<T id={'subtotal'} />}
                  value={formattedAmount(totals.subtotal, values.currencyCode)}
                />
                <TotalLine
                  title={intl.get('discount')}
                  value={formattedAmount(totals.discount, values.currencyCode)}
                  borderStyle={TotalLineBorderStyle.None}
                />
                <TotalLine
                  title={intl.get('adjustment')}
                  value={formattedAmount(
                    totals.adjustment,
                    values.currencyCode,
                  )}
                  borderStyle={TotalLineBorderStyle.None}
                />
                <TotalLine
                  title={<T id={'tax'} />}
                  value={formattedAmount(totals.taxAmount, values.currencyCode)}
                  borderStyle={TotalLineBorderStyle.None}
                />
                <TotalLine
                  title={`${intl.get('total')} (${values.currencyCode})`}
                  value={formattedAmount(totals.total, values.currencyCode)}
                  borderStyle={TotalLineBorderStyle.SingleDark}
                  textStyle={TotalLineTextStyle.Bold}
                />
              </TotalsLines>
            </Stack>
          </Col>
        </Row>
      </Paper>
    </x.div>
  );
}

const TotalsLines = styled(TotalLines)`
  margin-top: 12px;
`;
