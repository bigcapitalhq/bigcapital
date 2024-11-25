import {
  Button,
  Column,
  Container,
  Heading,
  render,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { EmailTemplateLayout } from './EmailTemplateLayout';
import { CSSProperties } from 'react';

export interface PaymentReceivedEmailTemplateProps {
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

  // # Items
  items: Array<{ label: string; total: string }>;

  // # Payment #
  paymentNumberLabel?: string;
  paymentNumber?: string;

  message?: string;
}

export const PaymentReceivedEmailTemplate: React.FC<
  Readonly<PaymentReceivedEmailTemplateProps>
> = ({
  preview,

  // # Company
  companyName = 'Bigcapital, Inc.',
  companyLogoUri,

  // # Colors
  primaryColor = 'rgb(0, 82, 204)',

  // # Payment #
  paymentNumberLabel = 'Payment # {paymentNumber}',
  paymentNumber = 'PAY-00001',

  // # Total
  total = '$1,000.00',
  totalLabel = 'Total',

  // # Subtotal
  subtotal,
  subtotalLabel = 'Subtotal',

  // # Items
  items,

  // # Message
  message,
}) => {
    return (
      <EmailTemplateLayout preview={preview}>
        <Container style={containerStyle}>
          {companyLogoUri && (
            <Section style={logoSectionStyle}>
              <div
                style={{
                  ...companyLogoStyle,
                  backgroundImage: `url("${companyLogoUri}")`,
                }}
              ></div>
            </Section>
          )}
          <Section style={headerInfoStyle}>
            <Row>
              <Heading style={paymentCompanyNameStyle}>{companyName}</Heading>
            </Row>
            <Row>
              <Text style={paymentAmountStyle}>{total}</Text>
            </Row>
            <Row>
              <Text style={paymentNumberStyle}>
                {paymentNumberLabel?.replace('{paymentNumber}', paymentNumber)}
              </Text>
            </Row>
          </Section>

          <Text style={paymentMessageStyle}>{message}</Text>

          <Section style={totalsSectionStyle}>
            {items.map((item, index) => (
              <Row key={index} style={itemLineRowStyle}>
                <Column width={'50%'}>
                  <Text style={listItemLabelStyle}>{item.label}</Text>
                </Column>

                <Column width={'50%'}>
                  <Text style={listItemAmountStyle}>
                    {item.total}
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

            <Row style={totalLineRowStyle}>
              <Column width={'50%'}>
                <Text style={totalLineItemLabelStyle}>{totalLabel}</Text>
              </Column>

              <Column width={'50%'}>
                <Text style={totalLineItemAmountStyle}>{total}</Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </EmailTemplateLayout>
    );
  };

/**
 * Renders the payment received mail template to string
 * @param {EstimatePaymentEmailProps} props
 * @returns {Promise<string>}
 */
export const renderPaymentReceivedEmailTemplate = (
  props: PaymentReceivedEmailTemplateProps
) => {
  return render(<PaymentReceivedEmailTemplate {...props} />);
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

const paymentAmountStyle: CSSProperties = {
  margin: 0,
  color: '#383E47',
  fontWeight: 500,
};
const paymentNumberStyle: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: '#404854',
};

const paymentCompanyNameStyle: CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 500,
  color: '#404854',
};

const paymentMessageStyle: CSSProperties = {
  whiteSpace: 'pre-line',
  margin: '0 0 20px 0',
  lineHeight: '20px',
};

const logoSectionStyle = {
  marginBottom: '15px',
};

const companyLogoStyle = {
  height: 90,
  width: 90,
  borderRadius: '3px',
  marginLeft: 'auto',
  marginRight: 'auto',
  textIndent: '-999999px',
  overflow: 'hidden',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'contain',
};

const totalLineRowStyle: CSSProperties = {
  borderBottom: '1px solid #000',
  height: 40,
};

const listItemLabelStyle: CSSProperties = {
  margin: 0,
};

const totalLineItemLabelStyle: CSSProperties = {
  ...listItemLabelStyle,
  fontWeight: 500,
};


const listItemAmountStyle: CSSProperties = {
  margin: 0,
  textAlign: 'right',
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
