import { isEmpty } from 'lodash';
import {
  PaperTemplate,
  PaperTemplateProps,
  PaperTemplateTotalBorder,
} from './PaperTemplate';
import { Box } from '../lib/layout/Box';
import { Text } from '../lib/text/Text';
import { Stack } from '../lib/layout/Stack';
import { Group } from '../lib/layout/Group';
import {
  DefaultPdfTemplateTerms,
  DefaultPdfTemplateItemDescription,
  DefaultPdfTemplateStatement,
  DefaultPdfTemplateItemName,
  DefaultPdfTemplateAddressBilledTo,
  DefaultPdfTemplateAddressBilledFrom,
} from './_constants';

interface InvoiceLine {
  item?: string;
  description?: string;
  quantity?: string;
  rate?: string;
  total?: string;
  discount?: string;
}

interface InvoiceTaxLine {
  label: string;
  amount: string;
}

export interface InvoicePaperTemplateProps extends PaperTemplateProps {
  primaryColor?: string;
  secondaryColor?: string;

  // Company
  showCompanyLogo?: boolean;
  companyLogoUri?: string;

  // Invoice number
  showInvoiceNumber?: boolean;
  invoiceNumber?: string;
  invoiceNumberLabel?: string;

  // Date of issue
  showDateIssue?: boolean;
  dateIssue?: string;
  dateIssueLabel?: string;

  // Due date
  showDueDate?: boolean;
  dueDate?: string;
  dueDateLabel?: string;

  companyName?: string;
  bigtitle?: string;

  // Address
  showCustomerAddress?: boolean;
  customerAddress?: string;

  showCompanyAddress?: boolean;
  companyAddress?: string;

  billedToLabel?: string;

  // Entries
  lineItemLabel?: string;
  lineQuantityLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;

  // # Line Discount
  lineDiscountLabel?: string;
  showLineDiscount?: boolean;

  // Total
  showTotal?: boolean;
  totalLabel?: string;
  total?: string;

  // Discount
  showDiscount?: boolean;
  discountLabel?: string;
  discount?: string;

  // Adjustment
  showAdjustment?: boolean;
  adjustmentLabel?: string;
  adjustment?: string;

  // Subtotal
  showSubtotal?: boolean;
  subtotalLabel?: string;
  subtotal?: string;

  // Payment made
  showPaymentMade?: boolean;
  paymentMadeLabel?: string;
  paymentMade?: string;

  showTaxes?: boolean;

  // Due Amount
  showDueAmount?: boolean;
  dueAmountLabel?: string;
  dueAmount?: string;

  // Footer
  termsConditionsLabel?: string;
  showTermsConditions?: boolean;
  termsConditions?: string;

  // Statement
  statementLabel?: string;
  showStatement?: boolean;
  statement?: string;

  lines?: Array<InvoiceLine>;
  taxes?: Array<InvoiceTaxLine>;
}

export function InvoicePaperTemplate({
  // # Colors
  primaryColor,
  secondaryColor,

  // # Company.
  companyName = 'Bigcapital Technology, Inc.',

  showCompanyLogo = true,
  companyLogoUri = '',

  // # Due date
  dueDate = 'September 3, 2024',
  dueDateLabel = 'Date due',
  showDueDate = true,

  // # Issue date.
  dateIssue = 'September 3, 2024',
  dateIssueLabel = 'Date of issue',
  showDateIssue = true,

  // Invoice #,
  invoiceNumberLabel = 'Invoice number',
  invoiceNumber = '346D3D40-0001',
  showInvoiceNumber = true,

  // Address
  showCustomerAddress = true,
  customerAddress = DefaultPdfTemplateAddressBilledTo,

  showCompanyAddress = true,
  companyAddress = DefaultPdfTemplateAddressBilledFrom,

  billedToLabel = 'Billed To',

  // Entries
  lineItemLabel = 'Item',
  lineQuantityLabel = 'Qty',
  lineRateLabel = 'Rate',
  lineTotalLabel = 'Total',

  totalLabel = 'Total',
  subtotalLabel = 'Subtotal',
  discountLabel = 'Discount',
  adjustmentLabel = 'Adjustment',
  paymentMadeLabel = 'Payment Made',
  dueAmountLabel = 'Balance Due',

  // # Line Discount
  lineDiscountLabel = 'Discount',
  showLineDiscount = false,

  // Totals
  showTotal = true,
  total = '$662.75',

  showSubtotal = true,
  showDiscount = true,
  showTaxes = true,
  showPaymentMade = true,
  showDueAmount = true,
  showAdjustment = true,

  subtotal = '630.00',
  discount = '0.00',
  adjustment = '',
  paymentMade = '100.00',
  dueAmount = '$562.75',

  // Footer paragraphs.
  termsConditionsLabel = 'Terms & Conditions',
  showTermsConditions = true,
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
  taxes = [
    { label: 'Sample Tax1 (4.70%)', amount: '11.75' },
    { label: 'Sample Tax2 (7.00%)', amount: '21.74' },
  ],

  // # Statement
  statementLabel = 'Statement',
  showStatement = true,
  statement = DefaultPdfTemplateStatement,
  ...props
}: InvoicePaperTemplateProps) {
  return (
    <PaperTemplate
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      {...props}
    >
      <Stack spacing={24}>
        <Group align="start" spacing={10}>
          <Stack flex={1}>
            <PaperTemplate.BigTitle title={'Invoice'} />

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
          </Stack>

          {companyLogoUri && showCompanyLogo && (
            <PaperTemplate.Logo logoUri={companyLogoUri} />
          )}
        </Group>

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
              {
                label: lineItemLabel,
                accessor: (data) => (
                  <Stack spacing={2}>
                    <Text>{data.item}</Text>
                    <Text color={'#5f6b7c'} fontSize={12}>
                      {data.description}
                    </Text>
                  </Stack>
                ),
                thStyle: { width: '60%' },
              },
              {
                label: lineQuantityLabel,
                accessor: 'quantity',
                align: 'right',
              },
              { label: lineRateLabel, accessor: 'rate', align: 'right' },
              {
                label: lineDiscountLabel,
                accessor: 'discount',
                align: 'right',
                visible: showLineDiscount,
              },
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
            {showDiscount && !isEmpty(discount) && (
              <PaperTemplate.TotalLine
                label={discountLabel}
                amount={discount}
              />
            )}
            {showAdjustment && !isEmpty(adjustment) && (
              <PaperTemplate.TotalLine
                label={adjustmentLabel}
                amount={adjustment}
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
            {showDueAmount && (
              <PaperTemplate.TotalLine
                label={dueAmountLabel}
                amount={dueAmount}
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
