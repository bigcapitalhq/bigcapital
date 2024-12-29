import { Meta, StoryFn } from '@storybook/react';
import {
  InvoicePaymentEmail,
  InvoicePaymentEmailProps,
} from './InvoicePaymentEmail';

export default {
  title: 'Email/InvoicePaymentEmail',
  component: InvoicePaymentEmail,
} as Meta;

const Template: StoryFn<InvoicePaymentEmailProps> = (args) => (
  <InvoicePaymentEmail {...args} />
);

export const Default: StoryFn<InvoicePaymentEmailProps> = Template.bind({});

Default.args = {
  // Add default props here
  invoiceNumber: 'INV-12345',
  companyName: 'Bigcapital, Inc.',
  invoiceMessage: `Hi Ahmed Bouhuolia,

Here's invoice # INV-00005 for $1,000.00

The amount outstanding of $1,000.00 is due on 10 Oct 2024.

From your online payment page you can print a PDF or view your outstanding bills.

If you have any questions, please let us know.

Thanks,
Bigcapital`,
  dueDate: ' 10 Oct 2024',
  total: '$1,000.00',
  subtotal: '$1,000.00',
  dueAmount: '$1,000.00',
  items: [{ label: 'Swaniawski Muller', quantity: '1', rate: '$1,000.00' }],
  adjustment: '$100.00',
  discount: '$100.00',
};
