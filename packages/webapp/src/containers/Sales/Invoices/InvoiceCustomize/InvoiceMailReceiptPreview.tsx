import {
  InvoiceMailReceipt,
  InvoiceMailReceiptProps,
} from './InvoiceMailReceipt';

export interface InvoiceMailReceiptPreviewProps
  extends Partial<InvoiceMailReceiptProps> {}

const receiptMessage = `Hi Ahmed,

Here’s invoice INV-0002 for AED 0.00

The amount outstanding of AED $100,00 is due on 2 October 2024

View your bill online From your online you can print a PDF or pay your outstanding bills,

If you have any questions, please let us know,

Thanks,
Mohamed
`;

export function InvoiceMailReceiptPreview(
  props: InvoiceMailReceiptPreviewProps,
) {
  const propsWithDefaults = {
    message: receiptMessage,
    companyName: 'Bigcapital Technology, Inc.',
    total: '$1,000.00',
    invoiceNumber: 'INV-0001',
    dueDate: '2 Oct 2024',
    subtotal: '$1,000.00',
    dueAmount: '$1,000.00',
    items: [{ label: 'Web development', total: '$1000.00', quantity: 1 }],
    companyLogoUri: ' ',
    ...props,
  };
  return <InvoiceMailReceipt {...propsWithDefaults} />;
}
