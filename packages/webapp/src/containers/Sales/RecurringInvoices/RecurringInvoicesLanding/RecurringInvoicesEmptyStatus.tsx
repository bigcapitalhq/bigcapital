import { Button, Intent } from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Can, EmptyStatus, FormattedMessage as T } from '@/components';
import {
  AbilitySubject,
  RecurringInvoiceAction,
} from '@/constants/abilityOption';

export function RecurringInvoicesEmptyStatus() {
  const history = useHistory();

  return (
    <EmptyStatus
      title={<T id={'recurring_invoice.empty.title'} />}
      description={<T id={'recurring_invoice.empty.description'} />}
      action={
        <Can
          I={RecurringInvoiceAction.Create}
          a={AbilitySubject.RecurringInvoice}
        >
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={() => history.push('/recurring-invoices/new')}
          >
            <T id={'new_recurring_invoice'} />
          </Button>
        </Can>
      }
    />
  );
}
