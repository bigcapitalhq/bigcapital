import {
  Button,
  Column,
  Heading,
  render,
  Row,
  Section,
  Text,
} from '@react-email/components';
import isEmpty from 'lodash.isempty';
import { EmailTemplateLayout } from './EmailTemplateLayout';
import { CSSProperties } from 'react';
import { EmailTemplate } from './EmailTemplate';

export interface CreditNoteEmailProps {
  preview: string;

  // # Company
  companyName?: string;
  companyLogoUri: string;

  // # Color
  primaryColor?: string;

  // # Total
  total: string;
  totalLabel?: string;

  // # Subtotal
  subtotal: string;
  subtotalLabel?: string;

  // # Adjustment
  adjustment?: string;
  adjustmentLabel?: string;

  // # Discount
  discount?: string;
  discountLabel?: string;

  // # Items
  items: Array<{ label: string; quantity: string; rate: string }>;

  // # View button
  viewButtonLabel?: string;
  viewButtonUrl?: string;

  // # Credit Note #
  creditNoteNumber?: string;
  creditNoteNumberLabel?: string;

  // # Message
  message?: string;
}

export const CreditNoteEmailTemplate: React.FC<
  Readonly<CreditNoteEmailProps>
> = ({
  preview,

  // # Company
  companyName = 'Bigcapital, Inc.',
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Invoice total
  total,
  totalLabel = 'Total',

  // # Subtotal
  subtotal,
  subtotalLabel = 'Subtotal',

  // # Discount
  discount,
  discountLabel = 'Discount',

  // # Adjustment
  adjustment,
  adjustmentLabel = 'Adjustment',

  // # Credit Note #
  creditNoteNumberLabel = 'Credit Note # {creditNoteNumber}',
  creditNoteNumber = 'CN-00001',

  // # View invoice button
  viewButtonLabel = 'View Credit Note',
  viewButtonUrl,

  // # Message
  message = '',

  // # Items
  items = [],
}) => {
  return (
    <EmailTemplateLayout preview={preview}>
      <EmailTemplate>
        <Section style={mainSectionStyle}>
          {companyLogoUri && <EmailTemplate.CompanyLogo src={companyLogoUri} />}

          <Section style={headerInfoStyle}>
            <Row>
              <Heading style={companyNameStyle}>{companyName}</Heading>
            </Row>
            <Row>
              <Text style={invoiceAmountStyle}>{total}</Text>
            </Row>
            <Row>
              <Text style={creditNumberStyle}>
                {creditNoteNumberLabel?.replace(
                  '{creditNoteNumber}',
                  creditNoteNumber
                )}
              </Text>
            </Row>
          </Section>

          <Text style={messageStyle}>{message}</Text>
          <Button
            href={viewButtonUrl}
            style={{
              ...viewInvoiceButtonStyle,
              backgroundColor: primaryColor,
            }}
          >
            {viewButtonLabel}
          </Button>

          <Section style={totalsSectionStyle}>
            {items.map((item, index) => (
              <Row key={index} style={itemLineRowStyle}>
                <Column width={'50%'}>
                  <Text style={listItemLabelStyle}>{item.label}</Text>
                </Column>

                <Column width={'50%'}>
                  <Text style={listItemAmountStyle}>
                    {item.quantity} x {item.rate}
                  </Text>
                </Column>
              </Row>
            ))}

            <Row style={totalLineRowStyle}>
              <Column width={'50%'}>
                <Text style={totalLineItemLabelStyle}>{subtotalLabel}</Text>
              </Column>

              <Column width={'50%'}>
                <Text style={totalLineItemAmountStyle}>{subtotal}</Text>
              </Column>
            </Row>

            {!isEmpty(discount) && (
              <Row style={itemLineRowStyle}>
                <Column width={'50%'}>
                  <Text style={listItemLabelStyle}>{discountLabel}</Text>
                </Column>

                <Column width={'50%'}>
                  <Text style={listItemAmountStyle}>{discount}</Text>
                </Column>
              </Row>
            )}

            {!isEmpty(adjustment) && (
              <Row style={itemLineRowStyle}>
                <Column width={'50%'}>
                  <Text style={listItemLabelStyle}>{adjustmentLabel}</Text>
                </Column>

                <Column width={'50%'}>
                  <Text style={listItemAmountStyle}>{adjustment}</Text>
                </Column>
              </Row>
            )}

            <Row style={totalLineRowStyle}>
              <Column width={'50%'}>
                <Text style={totalLineItemLabelStyle}>{totalLabel}</Text>
              </Column>

              <Column width={'50%'}>
                <Text style={totalLineItemAmountStyle}>{total}</Text>
              </Column>
            </Row>
          </Section>
        </Section>
      </EmailTemplate>
    </EmailTemplateLayout>
  );
};

/**
 * Renders the estimate mail template to string
 * @param {EstimatePaymentEmailProps} props
 * @returns {Promise<string>}
 */
export const renderCreditNoteEmailTemplate = (props: CreditNoteEmailProps) => {
  return render(<CreditNoteEmailTemplate {...props} />);
};

const containerStyle: CSSProperties = {
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: '500px',
  padding: '35px 25px',
  color: '#000',
  borderRadius: '5px',
};

const headerInfoStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: 20,
};

const mainSectionStyle: CSSProperties = {};

const invoiceAmountStyle: CSSProperties = {
  margin: 0,
  color: '#383E47',
  fontWeight: 500,
};

const creditNumberStyle: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#404854',
};

const companyNameStyle: CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 500,
  color: '#404854',
};

const viewInvoiceButtonStyle: CSSProperties = {
  display: 'block',
  cursor: 'pointer',
  textAlign: 'center',
  fontSize: 16,
  padding: '10px 15px',
  lineHeight: '1',
  backgroundColor: 'rgb(0, 82, 204)',
  color: '#fff',
  borderRadius: '5px',
};

const listItemLabelStyle: CSSProperties = {
  margin: 0,
};

const listItemAmountStyle: CSSProperties = {
  margin: 0,
  textAlign: 'right',
};

const messageStyle: CSSProperties = {
  whiteSpace: 'pre-line',
  margin: '0 0 20px 0',
  lineHeight: '20px',
};

const totalLineRowStyle: CSSProperties = {
  borderBottom: '1px solid #000',
  height: 40,
};

const totalLineItemLabelStyle: CSSProperties = {
  ...listItemLabelStyle,
  fontWeight: 500,
};

const totalLineItemAmountStyle: CSSProperties = {
  ...listItemAmountStyle,
  fontWeight: 600,
};

const itemLineRowStyle: CSSProperties = {
  borderBottom: '1px solid #D9D9D9',
  height: 40,
};

const totalsSectionStyle = {
  marginTop: '20px',
  borderTop: '1px solid #D9D9D9',
};
