import React from 'react'
// import { AtButton, AtButtonProps, AT_BUTTON_VARIANT } from '.'
// import { objectValuesToControls } from '../../../storybook-utils'
import { Meta } from '@storybook/react'
import { StoryFn } from '@storybook/react'
import { Test, TestProps } from './Test';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Test> = {
  title: 'Atoms/Button',
  component: Test,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // label: { control: 'text' },
    // variant: objectValuesToControls(AT_BUTTON_VARIANT),
    // onClick: { action: 'clicked' },
  },
}
export default meta

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Test> = (args: TestProps) => <Test {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: 'Button',
  variant: 'PRIMARY',
  onClick: () => alert('clicking primary'),
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Button',
  variant: 'SECONDARY',
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  label: 'Button',
  variant: 'TERTIARY',
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Button',
  isDisabled: true,
}