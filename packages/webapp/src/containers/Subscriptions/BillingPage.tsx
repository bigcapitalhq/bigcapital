// @ts-nocheck
import * as R from 'ramda';
import { Redirect } from 'react-router-dom';
import { BillingPageBoot } from './BillingPageBoot';
import { BillingPageContent } from './BillingPageContent';
import { DashboardInsider } from '@/components';
import { useDashboardMeta } from '@/hooks/query';
import withAlertActions from '../Alert/withAlertActions';

function BillingPageRoot({ openAlert }) {
  const { data: dashboardMeta } = useDashboardMeta({
    keepPreviousData: true,
  });

  // In case the edition is not Bigcapital Cloud, redirect to the homepage.
  if (!dashboardMeta.is_bigcapital_cloud) {
    return <Redirect to={{ pathname: '/' }} />;
  }
  return (
    <DashboardInsider>
      <BillingPageBoot>
        <BillingPageContent />
      </BillingPageBoot>
    </DashboardInsider>
  );
}

export default R.compose(withAlertActions)(BillingPageRoot);
