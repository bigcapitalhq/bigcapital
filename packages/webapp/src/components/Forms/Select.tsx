// @ts-nocheck
import React from 'react';
import { Button } from '@blueprintjs/core';
import { FormikSelect } from '@blueprintjs-formik/select';
import styled from 'styled-components';
import clsx from 'classnames';

export function FSelect({ ...props }) {
  const input = ({ activeItem, text, label, value }) => (
    <SelectButton
      text={text || props.placeholder || 'Select an item ...'}
      disabled={props.disabled || false}
      {...props.buttonProps}
      className={clsx({ 'is-selected': !!text }, props.className)}
    />
  );
  return <FormikSelect input={input} fill={true} {...props} />;
}

export const SelectButton = styled(Button)`
  --x-color-select-background: #fff;
  --x-color-select-border: #ced4da;
  --x-color-select-caret: #8d8d8d;

  .bp4-dark & {
    --x-color-select-background: rgba(17, 20, 24, 0.3);
    --x-color-select-border: rgba(255, 255, 255, 0.15);
    --x-color-select-caret: rgba(255, 255, 255, 0.25);
  }
  outline: none;
  box-shadow: 0 0 0 transparent;
  border: 1px solid var(--x-color-select-border);
  position: relative;
  padding-right: 30px;

  &.bp4-small {
    padding-right: 24px;
  }
  &:not(.is-selected):not([class*='bp4-intent-']):not(.bp4-minimal) {
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
  &:not([class*='bp4-intent-']):not(.bp4-disabled) {
    &,
    &:hover {
      background: var(--x-color-select-background);
    }
  }
  .bp4-intent-danger & {
    border-color: #db3737;
  }
`;
