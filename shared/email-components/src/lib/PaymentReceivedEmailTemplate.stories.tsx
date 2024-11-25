import { Meta, StoryFn } from '@storybook/react';
import {
  PaymentReceivedEmailTemplateProps,
  PaymentReceivedEmailTemplate,
} from './PaymentReceivedEmailTemplate';

export default {
  title: 'Email/PaymentReceivedEmailTemplate',
  component: PaymentReceivedEmailTemplate,
} as Meta;

const Template: StoryFn<PaymentReceivedEmailTemplateProps> = (args) => (
  <PaymentReceivedEmailTemplate {...args} />
);

export const Default: StoryFn<PaymentReceivedEmailTemplateProps> =
  Template.bind({

  });

Default.args = {
  message: `Hi Ahmed Bouhuolia,

Here's invoice # INV-00005 for $1,000.00

The amount outstanding of $1,000.00 is due on 10 Oct 2024.

From your online payment page you can print a PDF or view your outstanding bills.

If you have any questions, please let us know.

Thanks,
Bigcapital`,
  items: [{ label: 'INV-00001', total: '$1000.00' }]
};
