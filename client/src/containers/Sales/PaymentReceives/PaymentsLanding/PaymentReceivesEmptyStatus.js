import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { FormattedMessage as T } from 'react-intl';

export default function PaymentReceivesEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'the_organization_doesn_t_receive_money_yet'} />}
      description={
        <p>
          <T id={'it_is_a_long_established_fact_that_a_reader'} />
        </p>
      }
      action={
        <>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => {
              history.push('/payment-receives/new');
            }}
          >
            <T id={'new_payment_receive'} />
          </Button>

          <Button intent={Intent.NONE} large={true}>
            <T id={'learn_more'} />
          </Button>
        </>
      }
    />
  );
}
