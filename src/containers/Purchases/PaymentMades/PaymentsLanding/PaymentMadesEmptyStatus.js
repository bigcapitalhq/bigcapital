import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { Can, FormattedMessage as T } from 'components';
import {
  Payment_Made_Abilities,
  AbilitySubject,
} from '../../../../common/abilityOption';

export default function PaymentMadesEmptyStatus() {
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
          <Can I={Payment_Made_Abilities.Create} a={AbilitySubject.PaymentMade}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/payment-mades/new');
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
