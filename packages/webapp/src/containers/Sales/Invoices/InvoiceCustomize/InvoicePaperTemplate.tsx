import React from 'react';
import { PaperTemplate, PaperTemplateTotalBorder } from './PaperTemplate';
import { Group, Stack } from '@/components';

interface PapaerLine {
  item?: string;
  description?: string;
  quantity?: string;
  rate?: string;
  total?: string;
}

interface PaperTax {
  label: string;
  amount: string;
}

export interface InvoicePaperTemplateProps {
  primaryColor?: string;
  secondaryColor?: string;

  showCompanyLogo?: boolean;
  companyLogo?: string;

  showInvoiceNumber?: boolean;
  invoiceNumber?: string;
  invoiceNumberLabel?: string;

  showDateIssue?: boolean;
  dateIssue?: string;
  dateIssueLabel?: string;

  showDueDate?: boolean;
  dueDate?: string;
  dueDateLabel?: string;

  companyName?: string;
  bigtitle?: string;

  // Address
  showBillingToAddress?: boolean;
  showBilledFromAddress?: boolean;
  billedToLabel?: string;

  // Entries
  lineItemLabel?: string;
  lineDescriptionLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;

  // Totals
  showTotal?: boolean;
  totalLabel?: string;
  total?: string;

  showDiscount?: boolean;
  discountLabel?: string;
  discount?: string;

  showSubtotal?: boolean;
  subtotalLabel?: string;
  subtotal?: string;

  showPaymentMade?: boolean;
  paymentMadeLabel?: string;
  paymentMade?: string;

  showTaxes?: boolean;

  showDueAmount?: boolean;
  showBalanceDue?: boolean;
  balanceDueLabel?: string;
  balanceDue?: string;

  // Footer
  termsConditionsLabel?: string;
  showTermsConditions?: boolean;
  termsConditions?: string;

  statementLabel?: string;
  showStatement?: boolean;
  statement?: string;

  lines?: Array<PapaerLine>;
  taxes?: Array<PaperTax>;

  billedFromAddres?: Array<string | React.ReactNode>;
  billedToAddress?: Array<string | React.ReactNode>;
}

export function InvoicePaperTemplate({
  primaryColor,
  secondaryColor,

  companyName = 'Bigcapital Technology, Inc.',

  showCompanyLogo = true,
  companyLogo,

  dueDate = 'September 3, 2024',
  dueDateLabel = 'Date due',
  showDueDate = true,

  dateIssue = 'September 3, 2024',
  dateIssueLabel = 'Date of issue',
  showDateIssue = true,

  // dateIssue,
  invoiceNumberLabel = 'Invoice number',
  invoiceNumber = '346D3D40-0001',
  showInvoiceNumber = true,

  // Address
  showBillingToAddress = true,
  showBilledFromAddress = true,
  billedToLabel = 'Billed To',

  // Entries
  lineItemLabel = 'Item',
  lineDescriptionLabel = 'Description',
  lineRateLabel = 'Rate',
  lineTotalLabel = 'Total',

  totalLabel = 'Total',
  subtotalLabel = 'Subtotal',
  discountLabel = 'Discount',
  paymentMadeLabel = 'Payment Made',
  balanceDueLabel = 'Balance Due',

  // Totals
  showTotal = true,
  showSubtotal = true,
  showDiscount = true,
  showTaxes = true,
  showPaymentMade = true,
  showDueAmount = true,
  showBalanceDue = true,

  total = '$662.75',
  subtotal = '630.00',
  discount = '0.00',
  paymentMade = '100.00',
  balanceDue = '$562.75',

  // Footer paragraphs.
  termsConditionsLabel = 'Terms & Conditions',
  showTermsConditions = true,
  termsConditions = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',

  lines = [
    {
      item: 'Simply dummy text',
      description: 'Simply dummy text of the printing and typesetting',
      rate: '1',
      quantity: '1000',
      total: '$1000.00',
    },
  ],
  taxes = [
    { label: 'Sample Tax1 (4.70%)', amount: '11.75' },
    { label: 'Sample Tax2 (7.00%)', amount: '21.74' },
  ],

  statementLabel = 'Statement',
  showStatement = true,
  statement = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  billedToAddress = [
    'Bigcapital Technology, Inc.',
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  billedFromAddres = [
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
}: InvoicePaperTemplateProps) {
  return (
    <PaperTemplate
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      showCompanyLogo={showCompanyLogo}
      companyLogo={companyLogo}
      bigtitle={'Invoice'}
    >
      <Stack spacing={24}>
        <PaperTemplate.TermsList>
          {showInvoiceNumber && (
            <PaperTemplate.TermsItem label={invoiceNumberLabel}>
              {invoiceNumber}
            </PaperTemplate.TermsItem>
          )}
          {showDateIssue && (
            <PaperTemplate.TermsItem label={dateIssueLabel}>
              {dateIssue}
            </PaperTemplate.TermsItem>
          )}
          {showDueDate && (
            <PaperTemplate.TermsItem label={dueDateLabel}>
              {dueDate}
            </PaperTemplate.TermsItem>
          )}
        </PaperTemplate.TermsList>

        <Group spacing={10}>
          {showBilledFromAddress && (
            <PaperTemplate.Address
              items={[<strong>{companyName}</strong>, ...billedFromAddres]}
            />
          )}
          {showBillingToAddress && (
            <PaperTemplate.Address
              items={[<strong>{billedToLabel}</strong>, ...billedToAddress]}
            />
          )}
        </Group>

        <Stack spacing={0}>
          <PaperTemplate.Table
            columns={[
              { label: lineItemLabel, accessor: 'item' },
              { label: lineDescriptionLabel, accessor: 'description' },
              { label: lineRateLabel, accessor: 'rate', align: 'right' },
              { label: lineTotalLabel, accessor: 'total', align: 'right' },
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
            {showDiscount && (
              <PaperTemplate.TotalLine
                label={discountLabel}
                amount={discount}
              />
            )}
            {showTaxes && (
              <>
                {taxes.map((tax, index) => (
                  <PaperTemplate.TotalLine
                    key={index}
                    label={tax.label}
                    amount={tax.amount}
                  />
                ))}
              </>
            )}
            {showTotal && (
              <PaperTemplate.TotalLine
                label={totalLabel}
                amount={total}
                border={PaperTemplateTotalBorder.Dark}
                style={{ fontWeight: 500 }}
              />
            )}
            {showPaymentMade && (
              <PaperTemplate.TotalLine
                label={paymentMadeLabel}
                amount={paymentMade}
              />
            )}
            {showBalanceDue && (
              <PaperTemplate.TotalLine
                label={balanceDueLabel}
                amount={balanceDue}
                border={PaperTemplateTotalBorder.Dark}
                style={{ fontWeight: 500 }}
              />
            )}
          </PaperTemplate.Totals>
        </Stack>

        <Stack spacing={0}>
          {showTermsConditions && termsConditions && (
            <PaperTemplate.Statement label={termsConditionsLabel}>
              {termsConditions}
            </PaperTemplate.Statement>
          )}
          {showStatement && statement && (
            <PaperTemplate.Statement label={statementLabel}>
              {statement}
            </PaperTemplate.Statement>
          )}
        </Stack>
      </Stack>
    </PaperTemplate>
  );
}
