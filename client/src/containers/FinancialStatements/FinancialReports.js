import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { For } from 'components';

import financialReportMenus from 'config/financialReportsMenu';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';


function FinancialReportsItem({
  title,
  desc,
  link
}) {
  return (
    <div class="financial-reports__item">
      <Link class="title" to={link}>{ title }</Link>
      <p class="desc">{ desc }</p>
    </div>
  );
}

function FinancialReportsSection({
  sectionTitle,
  reports 
}) {
  return (
    <div class="financial-reports__section">
      <div class="section-title">{ sectionTitle }</div>

      <div class="financial-reports__list">
        <For render={FinancialReportsItem} of={reports} />
      </div>
    </div>
  )
}

function FinancialReports({
  // #withDashboardActions
  changePageTitle,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'all_financial_reports' }));
  }, [changePageTitle, formatMessage]);  

  return (
    <div class="financial-reports">
      <For render={FinancialReportsSection} of={financialReportMenus} />
    </div>
  );
}

export default compose(
  withDashboardActions
)(FinancialReports);