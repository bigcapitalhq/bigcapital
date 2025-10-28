import { Meta, StoryFn } from '@storybook/react';
import {
  EstimatePaymentEmailProps,
  EstimatePaymentEmail,
} from './EstimatePaymentEmail';

export default {
  title: 'Email/EstimatePaymentEmail',
  component: EstimatePaymentEmail,
} as Meta;

const Template: StoryFn<EstimatePaymentEmailProps> = (args) => (
  <EstimatePaymentEmail {...args} />
);

export const Default: StoryFn<EstimatePaymentEmailProps> = Template.bind({});

Default.args = {
  total: '$1,000.00',
  items: [{ label: 'Swaniawski Muller', quantity: '1', rate: '$1,000.00' }],
  message: `Hi Ahmed Bouhuolia,

Here's invoice # INV-00005 for $1,000.00

The amount outstanding of $1,000.00 is due on 10 Oct 2024.

From your online payment page you can print a PDF or view your outstanding bills.

If you have any questions, please let us know.

Thanks,
Bigcapital`,
  adjustment: '$100.00',
  discount: '$100.00',
  subtotal: '$100.00',
};
