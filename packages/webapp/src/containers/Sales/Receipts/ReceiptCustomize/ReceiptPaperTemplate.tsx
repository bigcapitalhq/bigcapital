import { Group, Stack } from '@/components';
import {
  PaperTemplate,
  PaperTemplateProps,
} from '../../Invoices/InvoiceCustomize/PaperTemplate';

export interface ReceiptPaperTemplateProps extends PaperTemplateProps {
  // Addresses
  billedToAddress?: Array<string>;
  billedFromAddress?: Array<string>;
  showBilledFromAddress?: boolean;
  showBilledToAddress?: boolean;
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
  primaryColor,
  secondaryColor,
  showCompanyLogo = true,
  companyLogo,
  companyName = 'Bigcapital Technology, Inc.',

  // # Address
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
  showBilledFromAddress = true,
  showBilledToAddress = true,
  billedToLabel = 'Billed To',

  total = '$1000.00',
  totalLabel = 'Total',
  showTotal = true,

  subtotal = '1000/00',
  subtotalLabel = 'Subtotal',
  showSubtotal = true,

  showCustomerNote = true,
  customerNote = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  customerNoteLabel = 'Customer Note',

  showTermsConditions = true,
  termsConditions = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  termsConditionsLabel = 'Terms & Conditions',

  lines = [
    {
      item: 'Simply dummy text',
      description: 'Simply dummy text of the printing and typesetting',
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
      companyLogo={companyLogo}
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
              { label: 'Description', accessor: 'item' },
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
