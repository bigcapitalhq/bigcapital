import { Button, Classes, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecurringInvoicesListContext } from './RecurringInvoicesListProvider';
import { withRecurringInvoicesActions } from './withRecurringInvoicesActions';
import type { WithRecurringInvoiceActionsProps } from './withRecurringInvoicesActions';
import {
  AdvancedFilterPopover,
  Can,
  DashboardActionViewsList,
  DashboardActionsBar,
  DashboardFilterButton,
  FormattedMessage as T,
  Icon,
} from '@/components';
import {
  AbilitySubject,
  RecurringInvoiceAction,
} from '@/constants/abilityOption';
import { recurringInvoicesKeys } from '@/hooks/query';

interface RecurringInvoicesActionsBarProps
  extends WithRecurringInvoiceActionsProps {
  recurringInvoicesFilterRoles: any[];
}

function RecurringInvoicesActionsBarInner({
  setRecurringInvoicesTableState,
  recurringInvoicesFilterRoles,
}: RecurringInvoicesActionsBarProps) {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { recurringInvoicesViews, fields } = useRecurringInvoicesListContext();

  const handleTabChange = (view: { slug?: string } | null) => {
    setRecurringInvoicesTableState({ viewSlug: view ? view.slug : null });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'recurring_invoices'}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          views={recurringInvoicesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can
          I={RecurringInvoiceAction.Create}
          a={AbilitySubject.RecurringInvoice}
        >
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_recurring_invoice'} />}
            onClick={() => history.push('/recurring-invoices/new')}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: recurringInvoicesFilterRoles,
            defaultFieldKey: 'profile_name',
            fields,
            onFilterChange: (filterConditions: any) => {
              setRecurringInvoicesTableState({
                filterRoles: filterConditions,
              });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={recurringInvoicesFilterRoles.length}
          />
        </AdvancedFilterPopover>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'refresh'} />}
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: recurringInvoicesKeys.all(),
            })
          }
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const RecurringInvoicesActionsBar = FF.pipe(
  RecurringInvoicesActionsBarInner,
  withRecurringInvoicesActions,
);
