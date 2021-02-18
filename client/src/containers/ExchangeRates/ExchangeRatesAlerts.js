import React from 'react';

import ExchangeRateDeleteAlert from 'containers/Alerts/ExchangeRates/ExchangeRateDeleteAlert';
// import ExchangeRateBulkDeleteAlert from 'containers/Alerts/ExchangeRates/ExchangeRateBulkDeleteAlert';

export default function ExchangeRatesAlerts() {
  return (
    <div>
      <ExchangeRateDeleteAlert name={'exchange-rate-delete'} />
    </div>
  );
}
