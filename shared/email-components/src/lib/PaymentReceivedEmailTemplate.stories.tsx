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
  Template.bind({});

Default.args = {};
