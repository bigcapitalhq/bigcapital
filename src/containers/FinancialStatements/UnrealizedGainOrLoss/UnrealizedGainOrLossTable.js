import React from 'react';
import intl from 'react-intl-universal';

import { DataTable } from 'components';
import FinancialSheet from 'components/FinancialSheet';

/**
 * Unrealized Gain or Loss table.
 */
export default function UnrealizedGainOrLossTable({
  // #ownProps
  companyName,
}) {
  return (
    <FinancialSheet
      name="unrealized-gain-loss"
      companyName={companyName}
      sheetType={intl.get('unrealized_gain_or_loss.label')}
    ></FinancialSheet>
  );
}
