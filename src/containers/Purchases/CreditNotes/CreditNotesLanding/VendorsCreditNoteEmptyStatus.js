import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { Can, FormattedMessage as T } from 'components';
import {
  VendorCreditAction,
  AbilitySubject,
} from '../../../../common/abilityOption';

export default function VendorsCreditNoteEmptyStatus() {
  const history = useHistory();
  return (
    <EmptyStatus
      title={<T id={'the_organization_doesn_t_receive_money_yet'} />}
      description={
        <p>
          <T id={'vendor_credits.empty_status_description'} />
        </p>
      }
      action={
        <>
          <Can I={VendorCreditAction.Create} a={AbilitySubject.VendorCredit}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => history.push('/vendor-credits/new')}
            >
              <T id={'vendor_credits.action.new_vendor_credit'} />
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
