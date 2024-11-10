
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
