import { Group, Stack } from '@/components';
import {
  PaperTemplate,
  PaperTemplateProps,
} from '../../Invoices/InvoiceCustomize/PaperTemplate';

export interface EstimatePaperTemplateProps extends PaperTemplateProps {
  estimateNumebr?: string;
  estimateNumberLabel?: string;
  showEstimateNumber?: boolean;

  expirationDate?: string;
  showExpirationDate?: boolean;
  expirationDateLabel?: string;

  estimateDateLabel?: string;
  showEstimateDate?: boolean;
  estimateDate?: string;

  companyName?: string;

  // Address
  showBilledToAddress?: boolean;
  billedToAddress?: Array<string>;

  showBilledFromAddress?: boolean;
  billedFromAddress?: Array<string>;
  billedToLabel?: string;

  // Totals
  total?: string;
  showTotal?: boolean;
  totalLabel?: string;

  subtotal?: string;
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Statements
  showCustomerNote?: boolean;
  customerNote?: string;
  customerNoteLabel?: string;

  showTermsConditions?: boolean;
  termsConditions?: string;
  termsConditionsLabel?: string;

  lines?: Array<{
    item: string;
    description: string;
    rate: string;
    quantity: string;
    total: string;
  }>;
}

export function EstimatePaperTemplate({
  primaryColor,
  secondaryColor,
  showCompanyLogo = true,
  companyLogo,
  companyName,

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
  showEstimateNumber = true,
  estimateNumberLabel = 'Estimate Number',
  estimateNumebr = '346D3D40-0001',

  estimateDate = 'September 3, 2024',
  showEstimateDate = true,
  estimateDateLabel = 'Estimate Date',

  expirationDateLabel = 'Expiration Date',
  showExpirationDate = true,
  expirationDate = 'September 3, 2024',
}: EstimatePaperTemplateProps) {
  return (
    <PaperTemplate
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      showCompanyLogo={showCompanyLogo}
      companyLogo={companyLogo}
      bigtitle={'Estimate'}
    >
      <Stack spacing={24}>
        <PaperTemplate.TermsList>
          {showEstimateNumber && (
            <PaperTemplate.TermsItem label={estimateNumberLabel}>
              {estimateNumebr}
            </PaperTemplate.TermsItem>
          )}

          {showEstimateDate && (
            <PaperTemplate.TermsItem label={estimateDateLabel}>
              {estimateDate}
            </PaperTemplate.TermsItem>
          )}

          {showExpirationDate && (
            <PaperTemplate.TermsItem label={expirationDateLabel}>
              {expirationDate}
            </PaperTemplate.TermsItem>
          )}
        </PaperTemplate.TermsList>

        <Group spacing={10}>
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
        </Group>

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
