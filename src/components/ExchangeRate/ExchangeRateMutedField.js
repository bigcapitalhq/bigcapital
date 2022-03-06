import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import {
  Button,
  Popover,
  PopoverInteractionKind,
  FormGroup,
  Position,
  Menu,
  Classes,
} from '@blueprintjs/core';
import {
  If,
  ExchangeRateInputGroup,
  Icon,
  FormattedMessage as T,
} from 'components';
import { isEqual, isUndefined } from 'lodash';

export function ExchangeRateMutedField({
  name,
  toCurrency,
  fromCurrency,
  exchangeRate,
  ...ExchangeRateprops
}) {
  if (isEqual(toCurrency, fromCurrency) && !isUndefined(toCurrency)) {
    return null;
  }
  const content = (
    <ExchangeRateFormGroupContent>
      <ExchangeRateInputGroup
        name={name}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        {...ExchangeRateprops}
      />
    </ExchangeRateFormGroupContent>
  );

  return (
    <ExchangeRateFormGroup
      label={`As on ${moment(new Date()).format('YYYY-MM-DD')},`}
    >
      <Popover
        content={content}
        interactionKind={PopoverInteractionKind.CLICK}
        position={Position.RIGHT_TOP}
        modifiers={{
          offset: { offset: '0, 4' },
        }}
        minimal={true}
        usePortal={false}
        target={<div />}
      >
        <ExchangeRateButton>
          1 {fromCurrency} = {exchangeRate} {toCurrency}
          <Button
            className={Classes.MINIMAL}
            rightIcon={<Icon icon="pen-18" />}
            small={true}
          />
        </ExchangeRateButton>
      </Popover>
    </ExchangeRateFormGroup>
  );
}

const ExchangeRateFormGroup = styled(FormGroup)`
  .bp3-label {
    font-size: 12px !important;
    opacity: 0.7;
    line-height: 0.5rem;
  }
`;

const ExchangeRateButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #0d244a;
`;

const ExchangeRateFormGroupContent = styled.div`
  .bp3-form-group {
    padding: 2px;
    margin: 2px 4px !important;
  }
`;
