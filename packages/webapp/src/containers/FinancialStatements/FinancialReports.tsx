import React from 'react';
import { Link } from 'react-router-dom';
import { useFilterFinancialReports } from './FilterFinancialReports';
import { For, DashboardInsider } from '@/components';
import { financialReportMenus } from '@/constants/financialReportsMenu';

import '@/style/pages/FinancialStatements/FinancialSheets.scss';

interface FinancialReportsItemProps {
  title: string;
  desc: string;
  link: string;
}

function FinancialReportsItem({
  title,
  desc,
  link,
}: FinancialReportsItemProps) {
  return (
    <div className="financial-reports__item">
      <Link className="title" to={link}>
        {title}
      </Link>
      <p className="desc">{desc}</p>
    </div>
  );
}

interface FinancialReportsSectionProps {
  sectionTitle: string;
  reports: FinancialReportsItemProps[];
}

function FinancialReportsSection({
  sectionTitle,
  reports,
}: FinancialReportsSectionProps) {
  return (
    <div className="financial-reports__section">
      <div className="section-title">{sectionTitle}</div>

      <div className="financial-reports__list">
        <For render={FinancialReportsItem} of={reports} />
      </div>
    </div>
  );
}

export function FinancialReports() {
  const financialReportMenu = useFilterFinancialReports(financialReportMenus);

  return (
    <DashboardInsider name={'financial-reports'}>
      <div className="financial-reports">
        <For render={FinancialReportsSection} of={financialReportMenu} />
      </div>
    </DashboardInsider>
  );
}
