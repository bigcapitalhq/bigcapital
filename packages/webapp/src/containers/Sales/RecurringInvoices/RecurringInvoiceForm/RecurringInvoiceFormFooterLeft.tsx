import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { RecurringInvoiceFormValues } from './utils';
import { FEditableText, FFormGroup, Stack } from '@/components';

/**
 * Recurring invoice form footer left section.
 */
export function RecurringInvoiceFormFooterLeft() {
  const { values } = useFormikContext<RecurringInvoiceFormValues>();

  return (
    <Stack spacing={20}>
      {/* --------- Invoice message --------- */}
      <FooterFormGroup
        name={'invoiceMessage'}
        label={intl.get('invoice_message')}
      >
        <FEditableText
          name={'invoiceMessage'}
          placeholder={intl.get(
            'recurring_invoice.field.invoice_message_placeholder',
          )}
          fastField
          multiline
        />
      </FooterFormGroup>

      {/* --------- Terms and conditions --------- */}
      <FooterFormGroup
        label={intl.get('invoice_form.label.terms_conditions')}
        name={'termsConditions'}
      >
        <FEditableText
          name={'termsConditions'}
          placeholder={intl.get(
            'recurring_invoice.field.terms_conditions_placeholder',
          )}
          multiline
          fastField
        />
      </FooterFormGroup>

      {/* --------- Email message --------- */}
      {values.deliveryMode === 'email' && (
        <FooterFormGroup
          name={'emailMessage'}
          label={intl.get('recurring_invoice.field.email_message')}
        >
          <FEditableText
            name={'emailMessage'}
            placeholder={intl.get(
              'recurring_invoice.field.email_message_placeholder',
            )}
            multiline
            fastField
          />
        </FooterFormGroup>
      )}
    </Stack>
  );
}

const FooterFormGroup = styled(FFormGroup)`
  &.bp4-form-group {
    .bp4-label {
      font-size: 12px;
      margin-bottom: 12px;
    }
    .bp4-form-content {
      margin-left: 10px;
    }
  }
`;
