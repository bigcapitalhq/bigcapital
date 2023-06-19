// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus, Can, FormattedMessage as T } from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';

export default function PaymentsMadeEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'payment_made.empty_status.title'} />}
      description={
        <p>
          <T id="payment_made_empty_status_description" />
        </p>
      }
      action={
        <>
          <Can I={PaymentMadeAction.Create} a={AbilitySubject.PaymentMade}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/payments-made/new');
              }}
            >
              <T id={'new_bill_payment'} />
            </Button>

            <Button intent={Intent.NONE} large={true}>
              <T id={'learn_more'} />
            </Button>
          </Can>
        </>
      }
    />
  );
}
