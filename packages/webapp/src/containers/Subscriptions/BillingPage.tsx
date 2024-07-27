// @ts-nocheck
import * as R from 'ramda';
import { Button } from '@blueprintjs/core';
import withAlertActions from '../Alert/withAlertActions';
import { BillingPageBoot } from './BillingPageBoot';

function BillingPageRoot({ openAlert }) {
  const handleCancelSubBtnClick = () => {
    openAlert('cancel-main-subscription');
  };
  const handleResumeSubBtnClick = () => {
    openAlert('resume-main-subscription');
  };
  const handleUpdatePaymentMethod = () => {};

  return (
    <BillingPageBoot>
      <h1>
        <Button onClick={handleCancelSubBtnClick}>Cancel Subscription</Button>
        <Button onClick={handleResumeSubBtnClick}>Resume Subscription</Button>
        <Button>Update Payment Method</Button>
      </h1>
    </BillingPageBoot>
  );
}

export default R.compose(withAlertActions)(BillingPageRoot);
