// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { For, DashboardInsider } from '@/components';
import useFilterFinancialReports from './FilterFinancialReports';
import { financialReportMenus } from '@/constants/financialReportsMenu';

import '@/style/pages/FinancialStatements/FinancialSheets.scss';

function FinancialReportsItem({ title, desc, link }) {
  return (
    <div class="financial-reports__item">
      <Link class="title" to={link}>
        {title}
      </Link>
      <p class="desc">{desc}</p>
    </div>
  );
}

function FinancialReportsSection({ sectionTitle, reports }) {
  return (
    <div class="financial-reports__section">
      <div class="section-title">{sectionTitle}</div>

      <div class="financial-reports__list">
        <For render={FinancialReportsItem} of={reports} />
      </div>
    </div>
  );
}

/**
 * Financial reports.
 */
export default function FinancialReports() {
  const financialReportMenu = useFilterFinancialReports(financialReportMenus);

  return (
    <DashboardInsider name={'financial-reports'}>
      <div class="financial-reports">
        <For render={FinancialReportsSection} of={financialReportMenu} />
      </div>
    </DashboardInsider>
  );
}
