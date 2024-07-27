// @ts-nocheck
import * as R from 'ramda';
import { Button } from '@blueprintjs/core';
import withAlertActions from '../Alert/withAlertActions';

function BillingPageRoot({ openAlert }) {
  const handleCancelSubBtnClick = () => {
    openAlert('cancel-main-subscription');
  };
  const handleResumeSubBtnClick = () => {
    openAlert('resume-main-subscription');
  };
  const handleUpdatePaymentMethod = () => {};

  return (
    <h1>
      <Button onClick={handleCancelSubBtnClick}>Cancel Subscription</Button>
      <Button onClick={handleResumeSubBtnClick}>Resume Subscription</Button>
      <Button>Update Payment Method</Button>
    </h1>
  );
}

export default R.compose(withAlertActions)(BillingPageRoot);
