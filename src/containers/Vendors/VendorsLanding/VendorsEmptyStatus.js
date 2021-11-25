import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus } from 'components';
import { Can, FormattedMessage as T } from 'components';
import {
  Vendor_Abilities,
  AbilitySubject,
} from '../../../common/abilityOption';

export default function VendorsEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'create_and_manage_your_organization_s_vendors'} />}
      description={
        <p>
          <T id={'here_a_list_of_your_organization_products_and_services'} />
        </p>
      }
      action={
        <>
          <Can I={Vendor_Abilities.Create} a={AbilitySubject.Vendor}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/vendors/new');
              }}
            >
              <T id={'new_vendor'} />
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
