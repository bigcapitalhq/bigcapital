import { Stack } from '@/components';
import {
  PaperTemplate,
  PaperTemplateProps,
} from '../../Invoices/InvoiceCustomize/PaperTemplate';
import {
  DefaultPdfTemplateTerms,
  DefaultPdfTemplateItemDescription,
  DefaultPdfTemplateStatement,
  DefaultPdfTemplateItemName,
} from '@/constants/PdfTemplates';

export interface CreditNotePaperTemplateProps extends PaperTemplateProps {
  // Address
  billedToAddress?: Array<string>;
  billedFromAddress?: Array<string>;
  showBilledToAddress?: boolean;
  showBilledFromAddress?: boolean;
  billedToLabel?: string;

  // Total
  total?: string;
  showTotal?: boolean;
  totalLabel?: string;

  // Subtotal;
  subtotal?: string;
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Customer Note.
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

  // Date issue.
  creditNoteDateLabel?: string;
  showCreditNoteDate?: boolean;
  creditNoteDate?: string;

  // Credit Number.
  creditNoteNumebr?: string;
  creditNoteNumberLabel?: string;
  showCreditNoteNumber?: boolean;
}

export function CreditNotePaperTemplate({
  // # Colors
  primaryColor,
  secondaryColor,

  // # Company Logo
  showCompanyLogo = true,
  companyLogoUri = '',

  companyName = 'Bigcapital Technology, Inc.',

  // Address
  billedToAddress = [
    'Bigcapital Technology, Inc.',
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  billedFromAddress = [
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  showBilledToAddress = true,
  showBilledFromAddress = true,
  billedToLabel = 'Billed To',

  // Total
  total = '$1000.00',
  totalLabel = 'Total',
  showTotal = true,

  // Subtotal
  subtotal = '1000/00',
  subtotalLabel = 'Subtotal',
  showSubtotal = true,

  // Customer note
  showCustomerNote = true,
  customerNote = DefaultPdfTemplateStatement,
  customerNoteLabel = 'Customer Note',

  // Terms & conditions
  showTermsConditions = true,
  termsConditions = DefaultPdfTemplateTerms,
  termsConditionsLabel = 'Terms & Conditions',

  lines = [
    {
      item: DefaultPdfTemplateItemName,
      description: DefaultPdfTemplateItemDescription,
      rate: '1',
      quantity: '1000',
      total: '$1000.00',
    },
  ],
  // Credit note number.
  showCreditNoteNumber = true,
  creditNoteNumberLabel = 'Credit Note Number',
  creditNoteNumebr = '346D3D40-0001',

  // Credit note date.
  creditNoteDate = 'September 3, 2024',
  showCreditNoteDate = true,
  creditNoteDateLabel = 'Credit Note Date',
}: CreditNotePaperTemplateProps) {
  return (
    <PaperTemplate
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      showCompanyLogo={showCompanyLogo}
      companyLogoUri={companyLogoUri}
      bigtitle={'Credit Note'}
    >
      <Stack spacing={24}>
        <PaperTemplate.TermsList>
          {showCreditNoteNumber && (
            <PaperTemplate.TermsItem label={creditNoteNumberLabel}>
              {creditNoteNumebr}
            </PaperTemplate.TermsItem>
          )}
          {showCreditNoteDate && (
            <PaperTemplate.TermsItem label={creditNoteDateLabel}>
              {creditNoteDate}
            </PaperTemplate.TermsItem>
          )}
        </PaperTemplate.TermsList>

        <PaperTemplate.AddressesGroup>
          {showBilledFromAddress && (
            <PaperTemplate.Address
              items={[<strong>{companyName}</strong>, ...billedFromAddress]}
            />
          )}
          {showBilledToAddress && (
            <PaperTemplate.Address
              items={[<strong>{billedToLabel}</strong>, ...billedToAddress]}
            />
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
