import { Meta } from '@storybook/react';
import { StoryFn } from '@storybook/react';
import {
  InvoicePaymentEmail,
  InvoicePaymentEmailProps,
} from './InvoicePaymentEmail';

const meta: Meta<typeof InvoicePaymentEmail> = {
  title: 'Invoice Payment Email',
  component: InvoicePaymentEmail,
};

export default meta;

const Template: StoryFn<typeof InvoicePaymentEmail> = (
  args: InvoicePaymentEmailProps
) => <InvoicePaymentEmail {...args} />;

export const PreviewInvoicePaymentMail = Template.bind({});

PreviewInvoicePaymentMail.args = {
  preview: 'Preview text',
  companyName: 'ABC Company',
  companyLogoUri: 'https://example.com/logo.png',
  invoiceAmount: '100.00',
  dueDate: '2022-12-31',
  invoiceMessage: 'Thank you for your purchase!',
  invoiceNumber: 'INV-001',
  dueAmount: '100.00',
  total: '100.00',
  viewInvoiceButtonUrl: 'https://example.com/invoice',
  items: [
    { label: 'Item 1', quantity: '1', rate: '50.00' },
    { label: 'Item 2', quantity: '2', rate: '25.00' },
  ],
};
