import React from 'react';
import intl from 'react-intl-universal';

import { DataTable } from 'components';
import FinancialSheet from 'components/FinancialSheet';

/**
 * Realized Gain or Loss table.
 */
export default function RealizedGainOrLossTable({
  // #ownProps
  companyName,
}) {
  return (
    <FinancialSheet
      name="realized-gain-loss"
      companyName={companyName}
      sheetType={intl.get('realized_gain_or_loss.label')}
    ></FinancialSheet>
  );
}
