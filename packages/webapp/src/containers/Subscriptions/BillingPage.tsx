// @ts-nocheck
import * as R from 'ramda';
import { Button } from '@blueprintjs/core';
import withAlertActions from '../Alert/withAlertActions';
import { BillingPageBoot } from './BillingPageBoot';
import { BillingPageContent } from './BillingPageContent';
import { DashboardInsider } from '@/components';

function BillingPageRoot({ openAlert }) {
  return (
    <DashboardInsider>
      <BillingPageBoot>
        <BillingPageContent />
      </BillingPageBoot>
    </DashboardInsider>
  );
}

export default R.compose(withAlertActions)(BillingPageRoot);
