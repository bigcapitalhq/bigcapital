import { Meta, StoryFn } from '@storybook/react';
import {
  ReceiptEmailTemplate,
  ReceiptEmailTemplateProps,
} from './ReceiptPaymentEmail';

export default {
  title: 'Email/ReceiptPaymentEmail',
  component: ReceiptEmailTemplate,
} as Meta;

const Template: StoryFn<ReceiptEmailTemplateProps> = (args) => (
  <ReceiptEmailTemplate {...args} />
);

export const Default: StoryFn<ReceiptEmailTemplateProps> = Template.bind({});

Default.args = {
  message: `Hi Ahmed Bouhuolia,

Here's invoice # INV-00005 for $1,000.00

The amount outstanding of $1,000.00 is due on 10 Oct 2024.

From your online payment page you can print a PDF or view your outstanding bills.

If you have any questions, please let us know.

Thanks,
Bigcapital`,
  adjustment: '$100.00',
  discount: '$100.00',
};
