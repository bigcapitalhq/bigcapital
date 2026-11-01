import { keepPreviousData } from '@tanstack/react-query';
import * as FF from 'fp-ts/function';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { withAlertActions } from '../Alert/withAlertActions';
import { withDashboardActions } from '../Dashboard/withDashboardActions';
import { BillingPageBoot } from './BillingPageBoot';
import { BillingPageContent } from './BillingPageContent';
import type { WithAlertActionsProps } from '../Alert/withAlertActions';
import type { WithDashboardActionsProps } from '../Dashboard/withDashboardActions';
import { useDashboardMeta } from '@/hooks/query';

interface BillingPageRootProps
  extends WithDashboardActionsProps,
    WithAlertActionsProps {}

function BillingPageRoot({
  // #withAlertActions
  openAlert: _openAlert,

  // #withDashboardActions
  changePreferencesPageTitle,
}: BillingPageRootProps) {
  const { data: dashboardMeta } = useDashboardMeta({
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    changePreferencesPageTitle('Billing');
  }, [changePreferencesPageTitle]);

  // In case the edition is not Bigcapital Cloud, redirect to the homepage.
  if (!dashboardMeta!.isBigcapitalCloud) {
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
