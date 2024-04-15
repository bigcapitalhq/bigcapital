// @ts-nocheck
import { Form } from 'formik';
import SubscriptionPlansSection from './SubscriptionPlansSection';
import SubscriptionPeriodsSection from './SubscriptionPeriodsSection';
import { Button, Intent } from '@blueprintjs/core';
import { T } from '@/components';

function StepSubscriptionActions() {
  return (
    <div>
      <Button type="submit" intent={Intent.PRIMARY} large={true}>
        <T id={'submit_voucher'} />
      </Button>
    </div>
  );
}

export default function SetupSubscriptionForm() {
  return (
    <Form>
      <div class="billing-plans">
        <SubscriptionPlansSection />
        <SubscriptionPeriodsSection />
        <StepSubscriptionActions />
      </div>
    </Form>
  );
}
