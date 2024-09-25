import { Stack } from '@/components';
import {
  PaperTemplate,
  PaperTemplateProps,
  PaperTemplateTotalBorder,
} from '../../Invoices/InvoiceCustomize/PaperTemplate';

export interface PaymentReceivedPaperTemplateProps extends PaperTemplateProps {
  billedToAddress?: Array<string>;
  showBillingToAddress?: boolean;

  billedFromAddress?: Array<string>;
  showBilledFromAddress?: boolean;
  billedToLabel?: string;

  // Total.
  total?: string;
  showTotal?: boolean;
  totalLabel?: string;

  // Subtotal.
  subtotal?: string;
  showSubtotal?: boolean;
  subtotalLabel?: string;

  lines?: Array<{
    paidAmount: string;
    invoiceAmount: string;
    invoiceNumber: string;
  }>;

  // Issue date.
  paymentReceivedDateLabel?: string;
  showPaymentReceivedDate?: boolean;
  paymentReceivedDate?: string;

  // Payment received number.
  paymentReceivedNumebr?: string;
  paymentReceivedNumberLabel?: string;
  showPaymentReceivedNumber?: boolean;
}

export function PaymentReceivedPaperTemplate({
  // # Colors
  primaryColor,
  secondaryColor,

  // # Company logo
  showCompanyLogo = true,
  companyLogoUri,

  // # Company name
  companyName = 'Bigcapital Technology, Inc.',

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
  showBilledFromAddress,
  showBillingToAddress,
  billedToLabel = 'Billed To',

  total = '$1000.00',
  totalLabel = 'Total',
  showTotal = true,

  subtotal = '1000/00',
  subtotalLabel = 'Subtotal',
  showSubtotal = true,

  lines = [
    {
      invoiceNumber: 'INV-00001',
      invoiceAmount: '$1000.00',
      paidAmount: '$1000.00',
    },
  ],
  showPaymentReceivedNumber = true,
  paymentReceivedNumberLabel = 'Payment Number',
  paymentReceivedNumebr = '346D3D40-0001',

  paymentReceivedDate = 'September 3, 2024',
  showPaymentReceivedDate = true,
  paymentReceivedDateLabel = 'Payment Date',
}: PaymentReceivedPaperTemplateProps) {
  return (
    <PaperTemplate
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      showCompanyLogo={showCompanyLogo}
      companyLogoUri={companyLogoUri}
      bigtitle={'Payment'}
    >
      <Stack spacing={24}>
        <PaperTemplate.TermsList>
          {showPaymentReceivedNumber && (
            <PaperTemplate.TermsItem label={paymentReceivedNumberLabel}>
              {paymentReceivedNumebr}
            </PaperTemplate.TermsItem>
          )}

          {showPaymentReceivedDate && (
            <PaperTemplate.TermsItem label={paymentReceivedDateLabel}>
              {paymentReceivedDate}
            </PaperTemplate.TermsItem>
          )}
        </PaperTemplate.TermsList>

        <PaperTemplate.AddressesGroup>
          {showBilledFromAddress && (
            <PaperTemplate.Address
              items={[<strong>{companyName}</strong>, ...billedFromAddress]}
            />
          )}
          {showBillingToAddress && (
            <PaperTemplate.Address
              items={[<strong>{billedToLabel}</strong>, ...billedToAddress]}
            />
          )}
        </PaperTemplate.AddressesGroup>

        <Stack spacing={0}>
          <PaperTemplate.Table
            columns={[
              { label: 'Invoice #', accessor: 'invoiceNumber' },
              {
                label: 'Invoice Amount',
                accessor: 'invoiceAmount',
                align: 'right',
              },
              { label: 'Paid Amount', accessor: 'paidAmount', align: 'right' },
            ]}
            data={lines}
          />
          <PaperTemplate.Totals>
            {showSubtotal && (
              <PaperTemplate.TotalLine
                label={subtotalLabel}
                amount={subtotal}
                border={PaperTemplateTotalBorder.Gray}
              />
            )}
            {showTotal && (
              <PaperTemplate.TotalLine
                label={totalLabel}
                amount={total}
                border={PaperTemplateTotalBorder.Dark}
                style={{ fontWeight: 500 }}
              />
            )}
          </PaperTemplate.Totals>
        </Stack>
      </Stack>
    </PaperTemplate>
  );
}
