import { Classes, Text } from '@blueprintjs/core';
import { Box, Group, Stack } from '@/components';
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

export interface CreditNotePaperTemplateProps extends PaperTemplateProps {
  // # Company logo
  showCompanyLogo?: boolean;
  companyLogoUri?: string;

  // # Company name
  companyName?: string;

  // Address
  showCustomerAddress?: boolean;
  customerAddress?: string;

  showCompanyAddress?: boolean;
  companyAddress?: string;

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

  // Entries
  lineItemLabel?: string;
  lineQuantityLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;
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
  showCustomerAddress = true,
  customerAddress = DefaultPdfTemplateAddressBilledTo,

  showCompanyAddress = true,
  companyAddress = DefaultPdfTemplateAddressBilledFrom,

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

  // Entries
  lineItemLabel = 'Item',
  lineQuantityLabel = 'Qty',
  lineRateLabel = 'Rate',
  lineTotalLabel = 'Total',
}: CreditNotePaperTemplateProps) {
  return (
    <PaperTemplate primaryColor={primaryColor} secondaryColor={secondaryColor}>
      <Stack spacing={24}>
        <Group align={'start'} spacing={10}>
          <Stack flex={1}>
            <PaperTemplate.BigTitle title={'Credit Note'} />

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
                    <Text
                      className={Classes.TEXT_MUTED}
                      style={{ fontSize: 12 }}
                    >
                      {data.description}
                    </Text>
                  </Stack>
                ),
              },
              { label: lineQuantityLabel, accessor: 'quantity' },
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
