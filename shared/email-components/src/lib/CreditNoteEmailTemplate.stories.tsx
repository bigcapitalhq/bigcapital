import { Meta, StoryFn } from '@storybook/react';
import {
  CreditNoteEmailProps,
  CreditNoteEmailTemplate,
} from './CreditNoteEmailTemplate';

export default {
  title: 'Email/CreditNoteEmailTemplate',
  component: CreditNoteEmailTemplate,
} as Meta;

const Template: StoryFn<CreditNoteEmailProps> = (args) => (
  <CreditNoteEmailTemplate {...args} />
);

export const Default: StoryFn<CreditNoteEmailProps> = Template.bind({});

Default.args = {
  total: '$1,000.00',
  items: [{ label: 'Swaniawski Muller', quantity: '1', rate: '$1,000.00' }],
};
