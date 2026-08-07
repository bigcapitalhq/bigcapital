// @ts-nocheck
import { isEqual } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { DetailItem } from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

/**
 * Detail exchange rate item.
 * @param {*} param0
 * @param {*} param1
 * @returns
 */
function DetailExchangeRate({ exchangeRate, toCurrency }) {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  if (isEqual(baseCurrency, toCurrency)) {
    return null;
  }

  return (
    <DetailItem label={intl.get('exchange_rate')}>
      1 {baseCurrency} = {exchangeRate} {toCurrency}
    </DetailItem>
  );
}

export const ExchangeRateDetailItem = DetailExchangeRate;
