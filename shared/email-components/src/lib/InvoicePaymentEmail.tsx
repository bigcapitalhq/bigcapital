import { CSSProperties } from 'react';
import {
  Button,
  Section,
  Heading,
  Text,
  Row,
  Column,
  render,
} from '@react-email/components';
import isEmpty from 'lodash.isempty';
import { EmailTemplateLayout } from './EmailTemplateLayout';
import { EmailTemplate } from './EmailTemplate';

export interface InvoicePaymentEmailProps {
  preview: string;

  // # Company
  companyName?: string;
  companyLogoUri?: string;

  // # Colors
  primaryColor?: string;

  // # Invoice amount
  invoiceAmount: string;

  // # Invoice message
  invoiceMessage: string;

  // # Invoice total
  total: string;
  totalLabel?: string;

  // # Invoice due amount
  dueAmount: string;
  dueAmountLabel?: string;

  // # Adjustment
  adjustment?: string;
  adjustmentLabel?: string;

  // # Discount
  discount?: string;
  discountLabel?: string;

  // # Subtotal
  subtotal: string;
  subtotalLabel?: string;

  // # Due date
  dueDate: string;
  dueDateLabel?: string;

  // # Invoice number
  invoiceNumberLabel?: string;
  invoiceNumber: string;

  // # View invoice button
  viewInvoiceButtonLabel?: string;
  viewInvoiceButtonUrl: string;

  // # Items
  items: Array<{ label: string; quantity: string; rate: string }>;
}

export const InvoicePaymentEmail: React.FC<
  Readonly<InvoicePaymentEmailProps>
> = ({
  preview,

  // # Company
  companyName,
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Invoice amount
  invoiceAmount,

  // # Invoice message
  invoiceMessage,

  // # Due date
  dueDate,
  dueDateLabel = 'Due {dueDate}',

  // # Invoice number
  invoiceNumber,
  invoiceNumberLabel = 'Invoice # {invoiceNumber}',

  // # invoice total
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

  // # Invoice due amount
  dueAmountLabel = 'Due Amount',
  dueAmount,

  // # View invoice button
  viewInvoiceButtonLabel = 'View Invoice',
  viewInvoiceButtonUrl,

  items,
}) => {
  return (
    <EmailTemplateLayout preview={preview}>
      <EmailTemplate>
        <Section style={mainSectionStyle}>
          {companyLogoUri && <EmailTemplate.CompanyLogo src={companyLogoUri} />}

          <Section style={headerInfoStyle}>
            <Row>
              <Heading style={invoiceCompanyNameStyle}>{companyName}</Heading>
            </Row>
            <Row>
              <Text style={invoiceAmountStyle}>{invoiceAmount}</Text>
            </Row>
            <Row>
              <Text style={invoiceNumberStyle}>
                {invoiceNumberLabel?.replace('{invoiceNumber}', invoiceNumber)}
              </Text>
            </Row>
            <Row>
              <Text style={invoiceDateStyle}>
                {dueDateLabel.replace('{dueDate}', dueDate)}
              </Text>
            </Row>
          </Section>

          <Text style={invoiceMessageStyle}>{invoiceMessage}</Text>
          <Button
            href={viewInvoiceButtonUrl}
            style={{
              ...viewInvoiceButtonStyle,
              backgroundColor: primaryColor,
            }}
          >
            {viewInvoiceButtonLabel}
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
              <Row style={lineRowStyle}>
                <Column width={'50%'}>
                  <Text style={listItemLabelStyle}>{discountLabel}</Text>
                </Column>

                <Column width={'50%'}>
                  <Text style={listItemAmountStyle}>{discount}</Text>
                </Column>
              </Row>
            )}

            {!isEmpty(adjustment) && (
              <Row style={lineRowStyle}>
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

            <Row style={dueAmounLineRowStyle}>
              <Column width={'50%'}>
                <Text style={dueAmountLineItemLabelStyle}>
                  {dueAmountLabel}
                </Text>
              </Column>

              <Column width={'50%'}>
                <Text style={dueAmountLineItemAmountStyle}>{dueAmount}</Text>
              </Column>
            </Row>
          </Section>
        </Section>
      </EmailTemplate>
    </EmailTemplateLayout>
  );
};

export const renderInvoicePaymentEmail = (props: InvoicePaymentEmailProps) => {
  return render(<InvoicePaymentEmail {...props} />);
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
const invoiceNumberStyle: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#404854',
};
const invoiceDateStyle: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#404854',
};

const invoiceCompanyNameStyle: CSSProperties = {
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

const invoiceMessageStyle: CSSProperties = {
  whiteSpace: 'pre-line',
  color: '#000',
  margin: '0 0 20px 0',
  lineHeight: '20px',
};

const dueAmounLineRowStyle: CSSProperties = {
  borderBottom: '1px solid #000',
  height: 40,
};

const lineRowStyle: CSSProperties = {
  borderBottom: '1px solid #D9D9D9',
  height: 40,
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

const dueAmountLineItemLabelStyle: CSSProperties = {
  ...listItemLabelStyle,
  fontWeight: 500,
};

const dueAmountLineItemAmountStyle: CSSProperties = {
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
