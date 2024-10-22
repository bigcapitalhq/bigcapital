import { InvoicePaymentPage, PaymentPageProps } from './PaymentPage';

export interface InvoicePaymentPagePreviewProps
  extends Partial<PaymentPageProps> { }

export function InvoicePaymentPagePreview(
  props: InvoicePaymentPagePreviewProps,
) {
  return (
    <InvoicePaymentPage
      paidAmount={'$1,000.00'}
      dueDate={'20 Sep 2024'}
      total={'$1,000.00'}
      subtotal={'$1,000.00'}
      dueAmount={'$1,000.00'}
      customerName={'Ahmed Bouhuolia'}
      organizationName={'Bigcapital Technology, Inc.'}
      invoiceNumber={'INV-000001'}
      companyLogoUri={' '}
      organizationAddress={' '}
      {...props}
    />
  );
}
