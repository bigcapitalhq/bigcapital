// @ts-nocheck
import intl from 'react-intl-universal';

export const filterProjectProfitabilityOptions = [
  {
    key: 'all-projects',
    name: intl.get(
      'project_profitability_summary.filter_projects.all_projects',
    ),
    hint: intl.get(
      'project_profitability_summary.filter_projects.all_projects.hint',
    ),
  },
  {
    key: 'without-zero-balance',
    name: intl.get(
      'project_profitability_summary.filter_projects.without_zero_balance',
    ),
    hint: intl.get(
      'project_profitability_summary.filter_projects.without_zero_balance.hint',
    ),
  },
  {
    key: 'with-transactions',
    name: intl.get(
      'project_profitability_summary.filter_projects.with_transactions',
    ),
    hint: intl.get(
      'project_profitability_summary.filter_projects.with_transactions.hint',
    ),
  },
];
