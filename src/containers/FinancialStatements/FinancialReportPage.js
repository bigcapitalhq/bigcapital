import React from 'react';
import classNames from 'classnames';
import { DashboardInsider } from 'components';
import { CLASSES } from 'common/classes';

import 'style/pages/FinancialStatements/FinancialReportPage.scss';

/**
 * Financial report page.
 */
export default function FinancialReportPage(props) {
  return (
    <DashboardInsider
      {...props}
      className={classNames(CLASSES.FINANCIAL_REPORT_INSIDER, props.className)}
    />
  );
}
