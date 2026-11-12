import { Button, Classes, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecurringJournalsListContext } from './RecurringJournalsListProvider';
import { withRecurringJournalsActions } from './withRecurringJournalsActions';
import type { WithRecurringJournalsActionsProps } from './withRecurringJournalsActions';
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
  RecurringJournalAction,
} from '@/constants/abilityOption';
import { recurringJournalsKeys } from '@/ee/recurring-journals/hooks/query';

interface RecurringJournalsActionsBarProps
  extends WithRecurringJournalsActionsProps {
  recurringJournalsFilterRoles: any[];
}

function RecurringJournalsActionsBarInner({
  setRecurringJournalsTableState,
  recurringJournalsFilterRoles,
}: RecurringJournalsActionsBarProps) {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { recurringJournalsViews, fields } = useRecurringJournalsListContext();

  const handleTabChange = (view: { slug?: string } | null) => {
    setRecurringJournalsTableState({ viewSlug: view ? view.slug : null });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'recurring_journals'}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          views={recurringJournalsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can
          I={RecurringJournalAction.Create}
          a={AbilitySubject.RecurringJournal}
        >
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_recurring_journal'} />}
            onClick={() => history.push('/recurring-journals/new')}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: recurringJournalsFilterRoles,
            defaultFieldKey: 'profile_name',
            fields,
            onFilterChange: (filterConditions: any) => {
              setRecurringJournalsTableState({
                filterRoles: filterConditions,
              });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={recurringJournalsFilterRoles.length}
          />
        </AdvancedFilterPopover>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'refresh'} />}
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: recurringJournalsKeys.all(),
            })
          }
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const RecurringJournalsActionsBar = FF.pipe(
  RecurringJournalsActionsBarInner,
  withRecurringJournalsActions,
);
