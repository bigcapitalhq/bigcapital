import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { Can, FormattedMessage as T } from 'components';
import {
  Bill_Abilities,
  AbilitySubject,
} from '../../../../common/abilityOption';

export default function BillsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'manage_the_organization_s_services_and_products'} />}
      description={
        <p>
          <T id="bill_empty_status_description" />
        </p>
      }
      action={
        <>
          <Can I={Bill_Abilities.Create} a={AbilitySubject.Bill}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/bills/new');
              }}
            >
              <T id={'new_bill'} />
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
