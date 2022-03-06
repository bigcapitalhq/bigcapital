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
    <Menu>
      <ExchangeRateInputGroup
        name={name}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        {...ExchangeRateprops}
      />
    </Menu>
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
      >
        <ExchangeRateButton
          className={Classes.MINIMAL}
          rightIcon={<Icon icon="pen-18" />}
        >
          1 {fromCurrency} = {exchangeRate} {toCurrency}
        </ExchangeRateButton>
      </Popover>
    </ExchangeRateFormGroup>
  );
}

const ExchangeRateFormGroup = styled(FormGroup)`
  .bp3-label {
    font-size: 12px !important;
    opacity: 0.7;
    line-height: 0.1rem;
  }
`;

const ExchangeRateButton = styled(Button)`
  .bp3-button-text {
    display: flex;
    font-size: 13px;
    font-weight: 500;
    color: #0d244a;
  }
  padding: 0;
`;
