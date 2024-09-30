import { Box, Stack } from '@/components';
import {
  PaperTemplate,
  PaperTemplateProps,
} from '../../Invoices/InvoiceCustomize/PaperTemplate';
import {
  DefaultPdfTemplateTerms,
  DefaultPdfTemplateItemDescription,
  DefaultPdfTemplateStatement,
  DefaultPdfTemplateItemName,
  DefaultPdfTemplateAddressBilledTo,
  DefaultPdfTemplateAddressBilledFrom,
} from '@/constants/PdfTemplates';

export interface ReceiptPaperTemplateProps extends PaperTemplateProps {
  // Addresses
  showCustomerAddress?: boolean;
  customerAddress?: string;

  showCompanyAddress?: boolean;
  companyAddress?: string;

  billedToLabel?: string;

  // Total
  total?: string;
  showTotal?: boolean;
  totalLabel?: string;

  // Subtotal
  subtotal?: string;
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Customer Note
  showCustomerNote?: boolean;
  customerNote?: string;
  customerNoteLabel?: string;

  // Terms & Conditions
  showTermsConditions?: boolean;
  termsConditions?: string;
  termsConditionsLabel?: string;

  // Lines
  lines?: Array<{
    item: string;
    description: string;
    rate: string;
    quantity: string;
    total: string;
  }>;

  // Receipt Date.
  receiptDateLabel?: string;
  showReceiptDate?: boolean;
  receiptDate?: string;

  // Receipt Number
  receiptNumebr?: string;
  receiptNumberLabel?: string;
  showReceiptNumber?: boolean;
}

export function ReceiptPaperTemplate({
  // # Colors
  primaryColor,
  secondaryColor,

  // # Company logo
  showCompanyLogo = true,
  companyLogoUri,

  // # Company name
  companyName = 'Bigcapital Technology, Inc.',

  // # Address
  showCustomerAddress = true,
  customerAddress = DefaultPdfTemplateAddressBilledTo,

  showCompanyAddress = true,
  companyAddress = DefaultPdfTemplateAddressBilledFrom,

  billedToLabel = 'Billed To',

  total = '$1000.00',
  totalLabel = 'Total',
  showTotal = true,

  subtotal = '1000/00',
  subtotalLabel = 'Subtotal',
  showSubtotal = true,

  showCustomerNote = true,
  customerNoteLabel = 'Customer Note',
  customerNote = DefaultPdfTemplateStatement,

  showTermsConditions = true,
  termsConditionsLabel = 'Terms & Conditions',
  termsConditions = DefaultPdfTemplateTerms,

  lines = [
    {
      item: DefaultPdfTemplateItemName,
      description: DefaultPdfTemplateItemDescription,
      rate: '1',
      quantity: '1000',
      total: '$1000.00',
    },
  ],
  showReceiptNumber = true,
  receiptNumberLabel = 'Receipt Number',
  receiptNumebr = '346D3D40-0001',

  receiptDate = 'September 3, 2024',
  showReceiptDate = true,
  receiptDateLabel = 'Receipt Date',
}: ReceiptPaperTemplateProps) {
  return (
    <PaperTemplate
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      showCompanyLogo={showCompanyLogo}
      companyLogoUri={companyLogoUri}
      bigtitle={'Receipt'}
    >
      <Stack spacing={24}>
        <PaperTemplate.TermsList>
          {showReceiptNumber && (
            <PaperTemplate.TermsItem label={receiptNumberLabel}>
              {receiptNumebr}
            </PaperTemplate.TermsItem>
          )}
          {showReceiptDate && (
            <PaperTemplate.TermsItem label={receiptDateLabel}>
              {receiptDate}
            </PaperTemplate.TermsItem>
          )}
        </PaperTemplate.TermsList>

        <PaperTemplate.AddressesGroup>
          {showCompanyAddress && (
            <PaperTemplate.Address>
              <Box dangerouslySetInnerHTML={{ __html: companyAddress }} />
            </PaperTemplate.Address>
          )}

          {showCustomerAddress && (
            <PaperTemplate.Address>
              <strong>{billedToLabel}</strong>
              <Box dangerouslySetInnerHTML={{ __html: customerAddress }} />
            </PaperTemplate.Address>
          )}
        </PaperTemplate.AddressesGroup>

        <Stack spacing={0}>
          <PaperTemplate.Table
            columns={[
              { label: 'Item', accessor: 'item' },
              { label: 'Description', accessor: 'description' },
              { label: 'Rate', accessor: 'rate', align: 'right' },
              { label: 'Total', accessor: 'total', align: 'right' },
            ]}
            data={lines}
          />
          <PaperTemplate.Totals>
            {showSubtotal && (
              <PaperTemplate.TotalLine
                label={subtotalLabel}
                amount={subtotal}
              />
            )}
            {showTotal && (
              <PaperTemplate.TotalLine label={totalLabel} amount={total} />
            )}
          </PaperTemplate.Totals>
        </Stack>

        <Stack spacing={0}>
          {showCustomerNote && (
            <PaperTemplate.Statement label={customerNoteLabel}>
              {customerNote}
            </PaperTemplate.Statement>
          )}
          {showTermsConditions && (
            <PaperTemplate.Statement label={termsConditionsLabel}>
              {termsConditions}
            </PaperTemplate.Statement>
          )}
        </Stack>
      </Stack>
    </PaperTemplate>
  );
}
