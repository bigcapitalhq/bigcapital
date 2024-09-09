import React from 'react';
import { Box } from '@/components';
import { Classes } from '@blueprintjs/core';
import { InvoicePaperTemplate } from './InvoicePaperTemplate';
import { ElementCustomize } from '../../../ElementCustomize/ElementCustomize';
import { InvoiceCustomizeGeneralField } from './InvoiceCustomizeGeneralFields';
import { InvoiceCustomizeContentFields } from './InvoiceCutomizeContentFields';

interface InvoiceCustomizeValues {
  invoiceNumber?: string;
  invoiceNumberLabel?: string;

  dateIssue?: string;
  dateIssueLabel?: string;

  dueDate?: string;
  dueDateLabel?: string;

  companyName?: string;

  bigtitle?: string;

  itemRateLabel?: string;
  itemQuantityLabel?: string;
  itemTotalLabel?: string;

  // Totals
  showDueAmount?: boolean;
  showDiscount?: boolean;
  showPaymentMade?: boolean;
  showTaxes?: boolean;
  showSubtotal?: boolean;
  showTotal?: boolean;
  showBalanceDue?: boolean;

  paymentMadeLabel?: string;
  discountLabel?: string;
  subtotalLabel?: string;
  totalLabel?: string;
  balanceDueLabel?: string;
}

export default function InvoiceCustomizeContent() {
  return (
    <Box className={Classes.DRAWER_BODY}>
      <ElementCustomize<InvoiceCustomizeValues>>
        <ElementCustomize.PaperTemplate>
          <InvoicePaperTemplate />
        </ElementCustomize.PaperTemplate>

        <ElementCustomize.FieldsTab id={'general'} label={'General'}>
          <InvoiceCustomizeGeneralField />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'content'} label={'Content'}>
          <InvoiceCustomizeContentFields />
        </ElementCustomize.FieldsTab>

        <ElementCustomize.FieldsTab id={'totals'} label={'Totals'}>
          asdfasdfdsaf #3
        </ElementCustomize.FieldsTab>
      </ElementCustomize>
    </Box>
  );
}
