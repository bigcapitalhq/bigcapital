export interface InvoicePaymentEmailSchemaProps {
  companyName: string;
  companyLogoUri: string;

  total: string;
  currencyCode: string;

  dueDate: string;
  paymentUrl: string;

  invoiceNumber: string;
  invoiceDate: string;
}

export function InvoicePaymentEmailSchema({
  companyName,
  companyLogoUri,

  currencyCode,
  total,

  paymentUrl,
  dueDate,

  invoiceDate,
  invoiceNumber
}: InvoicePaymentEmailSchemaProps) {
  return (
    <script type="application/ld+json">
      {`
    {
      "@context": "http://schema.org",
      "@type": "Invoice",
      "description": "Invoice for services rendered",
      "paymentStatus": "http://schema.org/PaymentDue",
      "totalPaymentDue": {
      "@type": "MonetaryAmount",
      "currency": "${currencyCode}",
        "value": "${total}"
      },
      "provider": {
        "@type": "Organization",
        "name": "${companyName}",
        "logo": "${companyLogoUri}",
        "telephone": "+1234567890"
      },
      "paymentDueDate": "${dueDate}",
      "paymentUrl": "${paymentUrl}",
      "referencesOrder": {
        "@type": "Order",
        "orderNumber": "${invoiceNumber}",
        "orderStatus": "http://schema.org/OrderPaymentDue",
        "orderDate": "${invoiceDate}"
      },
      "potentialAction": {
      "@type": "ViewAction",
      "target": "${paymentUrl}",
      "name": "View and Pay Invoice"
      }
    }
    `}
    </script>
  );
}
