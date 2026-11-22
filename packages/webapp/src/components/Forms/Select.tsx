// @ts-nocheck
import { Button } from '@blueprintjs/core';
import { Field } from '@blueprintjs-formik/core';
import { Select, type SelectOptionProps } from '@blueprintjs-formik/select';
import clsx from 'classnames';
import React from 'react';
import styled from 'styled-components';
import type { FieldProps } from 'formik';

export function FSelect<T extends object = SelectOptionProps>({
  ...props
}) {
  const { name, fastField, shouldUpdate, ...selectProps } = props;
  return (
    <Field {...selectProps} name={name} fastField={fastField} shouldUpdate={shouldUpdate}>
      {({ field, form }: FieldProps) => (
        <BPSelect<T>
          selectedValue={field.value}
          onValueChange={(value) => form.setFieldValue(name, value)}
          {...selectProps}
        />
      )}
    </Field>
  );
}

export function BPSelect<T extends object = SelectOptionProps>({
  ...props
}) {
  const input = ({ activeItem, text, label, value }) => (
    <SelectButton
      text={text || props.placeholder || 'Select an item ...'}
      disabled={props.disabled || false}
      {...props.buttonProps}
      className={clsx({ 'is-selected': !!text }, props.className)}
    />
  );
  return <Select<T> input={input} fill={true} {...props} />;
}

export const SelectButton = styled(Button)`
  --x-color-select-background: #fff;
  --x-color-select-border: #ced4da;
  --x-color-select-caret: #8d8d8d;

  .bp6-dark & {
    --x-color-select-background: rgba(17, 20, 24, 0.3);
    --x-color-select-border: rgba(255, 255, 255, 0.15);
    --x-color-select-caret: rgba(255, 255, 255, 0.25);
  }
  outline: none;
  box-shadow: 0 0 0 transparent;
  border: 1px solid var(--x-color-select-border);
  position: relative;
  padding-right: 30px;

  &.bp6-small {
    padding-right: 24px;
  }
  &:not(.is-selected):not([class*='bp6-intent-']):not(.bp6-minimal) {
    color: #8f99a8;
  }
  &:after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid var(--x-color-select-caret);

    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -2px;
    margin-right: 12px;
    border-radius: 1px;
  }
  &:not([class*='bp6-intent-']):not(.bp6-disabled) {
    &,
    &:hover {
      background: var(--x-color-select-background);
    }
  }
  .bp6-intent-danger & {
    border-color: #db3737;
  }
`;
