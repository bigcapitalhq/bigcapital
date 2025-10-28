// @ts-nocheck
import { useEffect } from 'react';
import * as R from 'ramda';
import { Redirect } from 'react-router-dom';
import { BillingPageBoot } from './BillingPageBoot';
import { BillingPageContent } from './BillingPageContent';
import { useDashboardMeta } from '@/hooks/query';
import withAlertActions from '../Alert/withAlertActions';
import withDashboardActions from '../Dashboard/withDashboardActions';

function BillingPageRoot({
  openAlert,

  // #withAlertActions
  changePreferencesPageTitle,
}) {
  const { data: dashboardMeta } = useDashboardMeta({
    keepPreviousData: true,
  });

  useEffect(() => {
    changePreferencesPageTitle('Billing');
  }, [changePreferencesPageTitle]);

  // In case the edition is not Bigcapital Cloud, redirect to the homepage.
  if (!dashboardMeta.is_bigcapital_cloud) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <BillingPageBoot>
      <BillingPageContent />
    </BillingPageBoot>
  );
}

export default R.compose(
  withAlertActions,
  withDashboardActions,
)(BillingPageRoot);
