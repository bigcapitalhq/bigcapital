// @ts-nocheck
import * as FF from 'fp-ts/function';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { withAlertActions } from '../Alert/withAlertActions';
import { withDashboardActions } from '../Dashboard/withDashboardActions';
import { BillingPageBoot } from './BillingPageBoot';
import { BillingPageContent } from './BillingPageContent';
import { useDashboardMeta } from '@/hooks/query';

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
  if (!dashboardMeta.isBigcapitalCloud) {
    return <Redirect to={{ pathname: '/' }} />;
  }

  return (
    <BillingPageBoot>
      <BillingPageContent />
    </BillingPageBoot>
  );
}

export const BillingPage = FF.pipe(
  BillingPageRoot,
  withDashboardActions,
  withAlertActions,
);
