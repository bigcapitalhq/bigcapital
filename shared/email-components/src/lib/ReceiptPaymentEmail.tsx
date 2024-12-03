import { CSSProperties } from 'react';
import {
  Column,
  Heading,
  render,
  Row,
  Section,
  Text,
} from '@react-email/components';
import isEmpty from 'lodash.isempty';
import { EmailTemplateLayout } from './EmailTemplateLayout';
import { EmailTemplate } from './EmailTemplate';
export interface ReceiptEmailTemplateProps {
  preview: string;

  companyName?: string;
  companyLogoUri: string;

  // # Colors
  primaryColor?: string;

  // # Receipt #
  receiptNumber?: string;
  receiptNumberLabel?: string;

  // # Items
  items: Array<{ label: string; quantity: string; rate: string }>;

  // # Invoice total
  total: string;
  totalLabel?: string;

  // # Discount
  discount?: string;
  discountLabel?: string;

  // # Adjustment
  adjustment?: string;
  adjustmentLabel?: string;

  // # Subtotal
  subtotal?: string;
  subtotalLabel?: string;

  // # Message
  message?: string;
}

export const ReceiptEmailTemplate: React.FC<
  Readonly<ReceiptEmailTemplateProps>
> = ({
  preview,

  // # Company
  companyName = 'Bigcapital, Inc.',
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Invoice total
  total = '$1,000.00',
  totalLabel = 'Total',

  // # Diso
  discountLabel = 'Discount',
  discount,

  // # ADjustment
  adjustmentLabel = 'Adjustment',
  adjustment,

  // # Subtotal
  subtotal = '$1,000.00',
  subtotalLabel = 'Subtotal',

  // # Receipt #
  receiptNumberLabel = 'Receipt # {receiptNumber}',
  receiptNumber = 'REC-00001',

  // # Message
  message = '',

  // # Items
  items = [{ label: 'Swaniawski Muller', quantity: '1', rate: '$1,000.00' }],
}) => {
  return (
    <EmailTemplateLayout preview={preview}>
      <EmailTemplate>
        {companyLogoUri && <EmailTemplate.CompanyLogo src={companyLogoUri} />}

        <Section style={headerInfoStyle}>
          <Row>
            <Heading style={invoiceCompanyNameStyle}>{companyName}</Heading>
          </Row>

          <Row>
            <Text style={amountStyle}>{total}</Text>
          </Row>

          <Row>
            <Text style={receiptNumberStyle}>
              {receiptNumberLabel?.replace('{receiptNumber}', receiptNumber)}
            </Text>
          </Row>
        </Section>

        <Text style={messageStyle}>{message}</Text>

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
              <Text style={dueAmountLineItemLabelStyle}>{subtotalLabel}</Text>
            </Column>

            <Column width={'50%'}>
              <Text style={dueAmountLineItemAmountStyle}>{subtotal}</Text>
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
      </EmailTemplate>
    </EmailTemplateLayout>
  );
};

/**
 * Renders the sale receipt mail template to string
 * @param {ReceiptEmailTemplateProps} props
 * @returns {Promise<string>}
 */
export const renderReceiptEmailTemplate = (
  props: ReceiptEmailTemplateProps
) => {
  return render(<ReceiptEmailTemplate {...props} />);
};

const headerInfoStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: 20,
};

const amountStyle: CSSProperties = {
  margin: 0,
  color: '#383E47',
  fontWeight: 500,
};
const receiptNumberStyle: CSSProperties = {
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
