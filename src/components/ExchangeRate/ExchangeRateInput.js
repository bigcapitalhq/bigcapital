import React from 'react';
import styled from 'styled-components';
import { ControlGroup } from '@blueprintjs/core';

import { FlagIcon } from '../Tags';
import { FMoneyInputGroup, FFormGroup } from '../Forms';

export function ExchangeRateInputGroup({
  fromCurrency,
  toCurrency,
  inputGroupProps,
  formGroupProps,
  name,
}) {
  return (
    <FFormGroup inline={true} {...formGroupProps} name={name}>
      <ControlGroup>
        <ExchangeRatePrepend>
          <ExchangeFlagIcon currencyCode={fromCurrency} /> 1 {fromCurrency} =
        </ExchangeRatePrepend>
        <ExchangeRateField
          allowDecimals={true}
          allowNegativeValue={true}
          {...inputGroupProps}
          name={name}
        />
        <ExchangeRateAppend>
          <ExchangeFlagIcon currencyCode={toCurrency} /> {toCurrency}
        </ExchangeRateAppend>
      </ControlGroup>
    </FFormGroup>
  );
}

const ExchangeRateField = styled(FMoneyInputGroup)`
  max-width: 75px;
`;

const ExchangeRateSideIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 1;
`;

const ExchangeRatePrepend = styled(ExchangeRateSideIcon)`
  padding-right: 8px;
`;

const ExchangeRateAppend = styled(ExchangeRateSideIcon)`
  padding-left: 8px;
`;

const ExchangeFlagIcon = styled(FlagIcon)`
  margin-right: 5px;
  margin-left: 5px;
  display: inline-block;
`;
