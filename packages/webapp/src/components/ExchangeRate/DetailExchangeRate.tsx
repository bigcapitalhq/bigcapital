// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import { DetailItem } from '@/components';
import { isEqual } from 'lodash';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

/**
 * Detail exchange rate item.
 * @param {*} param0
 * @param {*} param1
 * @returns
 */
function DetailExchangeRate({
  exchangeRate,
  toCurrency,
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  if (isEqual(base_currency, toCurrency)) {
    return null;
  }

  return (
    <DetailItem label={intl.get('exchange_rate')}>
      1 {base_currency} = {exchangeRate} {toCurrency}
    </DetailItem>
  );
}

export const ExchangeRateDetailItem = R.compose(withCurrentOrganization())(
  DetailExchangeRate,
);
