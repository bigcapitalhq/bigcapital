// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { Can, FormattedMessage as T, EmptyStatus } from '@/components';
import { AbilitySubject, CustomerAction } from '@/constants/abilityOption';

export default function CustomersEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'create_and_manage_your_organization_s_customers'} />}
      description={
        <p>
          <T id={'here_a_list_of_your_organization_products_and_services'} />
        </p>
      }
      action={
        <>
          <Can I={CustomerAction.Create} a={AbilitySubject.Customer}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/customers/new');
              }}
            >
              <T id={'new_customer'} />
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
