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
  // Add default props here
};
