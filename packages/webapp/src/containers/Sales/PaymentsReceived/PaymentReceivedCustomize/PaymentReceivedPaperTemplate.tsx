import { Group, Stack } from '@/components';
import { PaperTemplate, PaperTemplateProps } from '../../Invoices/InvoiceCustomize/PaperTemplate';

export interface PaymentReceivedPaperTemplateProps extends PaperTemplateProps {
  billedToAddress?: Array<string>;
  billedFromAddress?: Array<string>;

  total?: string;
  showTotal?: boolean;
  totalLabel?: string;

  subtotal?: string;
  showSubtotal?: boolean;
  subtotalLabel?: string;

  lines?: Array<{
    paidAmount: string;
    invoiceAmount: string;
    invoiceNumber: string;
  }>;

  paymentReceivedDateLabel?: string;
  showPaymentReceivedDate?: boolean;
  paymentReceivedDate?: string;

  paymentReceivedNumebr?: string;
  paymentReceivedNumberLabel?: string;
  showPaymentReceivedNumber?: boolean;
}

export function PaymentReceivedPaperTemplate({
  primaryColor,
  secondaryColor,
  showCompanyLogo = true,
  companyLogo,

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
      companyLogo={companyLogo}
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

        <Group spacing={10}>
          <PaperTemplate.Address items={billedToAddress} />
          <PaperTemplate.Address items={billedFromAddress} />
        </Group>

        <Stack spacing={0}>
          <PaperTemplate.Table
            columns={[
              { label: 'Invoice #', accessor: 'invoiceNumber' },
              { label: 'Invoice Amount', accessor: 'invoiceAmount' },
              { label: 'Paid Amount', accessor: 'paidAmount' },
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
      </Stack>
    </PaperTemplate>
  );
}
