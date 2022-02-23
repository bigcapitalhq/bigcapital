import React from 'react';
import { DetailItem } from 'components';
import intl from 'react-intl-universal';

import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { isEqual } from 'lodash';

const organizationBaseCurrecy = createSelector(
  (state) => {
    const tenantId = state.authentication.tenantId;
    return state.organizations.data[tenantId];
  },
  (organization) => organization?.base_currency,
);

export function ExchangeRateDetailItem({
  // #ownProps
  exchangeRate,
  toCurrency,
}) {
  const fromCurrency = useSelector(organizationBaseCurrecy);

  if (isEqual(fromCurrency, toCurrency)) {
    return null;
  }

  return (
    <DetailItem label={intl.get('invoice.details.exchange_rate')}>
      1 {fromCurrency} = {exchangeRate} {toCurrency}
    </DetailItem>
  );
}
