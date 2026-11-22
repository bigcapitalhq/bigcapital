// @ts-nocheck
import {
  Button,
  Popover,
  PopoverInteractionKind,
  FormGroup,
  Position,
  Classes,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { ExchangeRateInputGroup, Icon } from '@/components';

interface ExchangeRateMutedFieldProps {
  name?: string;
  toCurrency?: React.ReactNode;
  fromCurrency?: React.ReactNode;
  date?: React.ReactNode;
  exchangeRate?: React.ReactNode;
  exchangeRateFieldProps?: Record<string, unknown>;
  popoverProps?: Record<string, unknown>;
  formGroupProps?: Record<string, unknown>;
}

export function ExchangeRateMutedField({
  name,
  toCurrency,
  fromCurrency,
  date,
  exchangeRate,
  exchangeRateFieldProps,
  popoverProps,
  ...formGroupProps
}: ExchangeRateMutedFieldProps) {
  const content = (
    <ExchangeRateFormGroupContent>
      <ExchangeRateInputGroup
        name={name}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        {...exchangeRateFieldProps}
      />
    </ExchangeRateFormGroupContent>
  );

  return (
    <ExchangeRateFormGroup label={`As on ${date},`} {...formGroupProps}>
      <Popover
        content={content}
        interactionKind={PopoverInteractionKind.CLICK}
        position={Position.RIGHT_TOP}
        modifiers={{
          offset: { options: { offset: [0, 4] } },
        }}
        {...popoverProps}
        minimal={true}
        usePortal={false}
      >
        <ExchangeRateButton>
          1 {fromCurrency} = {exchangeRate} {toCurrency}
          <Button
            className={Classes.MINIMAL}
            rightIcon={<Icon icon="pen-18" iconSize={14} />}
            small={true}
          />
        </ExchangeRateButton>
      </Popover>
    </ExchangeRateFormGroup>
  );
}

const ExchangeRateFormGroup = styled(FormGroup)`
  &.bp6-form-group {
    label.bp6-label {
      font-size: 12px;
      opacity: 0.7;
      line-height: 1;
      margin-bottom: 5px;
    }
  }
`;

const ExchangeRateButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 400;
  color: #0d244a;
  position: relative;
  padding-right: 28px;

  .bp6-button {
    position: absolute;
    right: 0;
  }
`;

const ExchangeRateFormGroupContent = styled.div`
  padding: 5px 0;

  .bp6-form-group {
    padding: 2px;
    margin: 2px 4px !important;
  }
`;
