import {
  Button,
  Container,
  Heading,
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

  // # Items
  items: Array<{ label: string; quantity: string; rate: string }>;

  // # View payment button
  viewPaymentButtonLabel?: string;
  viewPaymentButtonUrl?: string;

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

  // # Items
  items,

  message = '',

  // # View invoice button
  viewPaymentButtonLabel = 'View Payment',
  viewPaymentButtonUrl,
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
              <Heading style={invoiceCompanyNameStyle}>{companyName}</Heading>
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

          <Text style={invoiceMessageStyle}>{message}</Text>
          <Button
            href={viewPaymentButtonUrl}
            style={{
              ...viewInvoiceButtonStyle,
              backgroundColor: primaryColor,
            }}
          >
            {viewPaymentButtonLabel}
          </Button>
        </Container>
      </EmailTemplateLayout>
    );
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

const invoiceMessageStyle: CSSProperties = {
  whiteSpace: 'pre-line',
  color: '#252A31',
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
