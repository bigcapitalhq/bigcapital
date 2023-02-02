// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EmptyStatus, Can, FormattedMessage as T } from '@/components';
import { SaleInvoiceAction, AbilitySubject } from '@/constants/abilityOption';

export default function EstimatesEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'the_organization_doesn_t_receive_money_yet'} />}
      description={
        <p>
          <T id={'invoices_empty_status_description'} />
        </p>
      }
      action={
        <>
          <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                history.push('/invoices/new');
              }}
            >
              <T id={'new_sale_invoice'} />
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
