// @ts-nocheck
import { useMemo } from 'react';
import * as R from 'ramda';
import { useAppQueryString } from '@/hooks';
import { Group, Icon } from '@/components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { TagsControl } from '@/components/TagsControl';
import { Button, Classes, Position } from '@blueprintjs/core';
import { AccountTransactionsDateFilterForm } from './AccountTransactionsDateFilter';
import { Popover2 } from '@blueprintjs/popover2';

export function AccountTransactionsUncategorizeFilter() {
  const { bankAccountMetaSummary } = useAccountTransactionsContext();
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const totalUncategorized =
    bankAccountMetaSummary?.totalUncategorizedTransactions;
  const totalRecognized = bankAccountMetaSummary?.totalRecognizedTransactions;

  const totalPending = bankAccountMetaSummary?.totalPendingTransactions;

  const handleTabsChange = (value) => {
    setLocationQuery({ uncategorizedFilter: value });
  };

  const options = useMemo(
    () =>
      R.when(
        () => totalPending > 0,
        R.append({
          value: 'pending',
          label: (
            <>
              Pending <strong>({totalPending})</strong>
            </>
          ),
        }),
      )([
        {
          value: 'all',
          label: (
            <>
              All <strong>({totalUncategorized})</strong>
            </>
          ),
        },
        {
          value: 'recognized',
          label: (
            <>
              Recognized <strong>({totalRecognized})</strong>
            </>
          ),
        },
      ]),
    [totalPending, totalRecognized, totalUncategorized],
  );

  return (
    <Group position={'apart'}>
      <Group>
        <TagsControl
          options={options}
          value={locationQuery?.uncategorizedFilter || 'all'}
          onValueChange={handleTabsChange}
        />
        <Popover2
          content={<UncategorizedTransactionsDateFilter />}
          position={Position.RIGHT}
          popoverClassName={Classes.POPOVER_CONTENT_SIZING}
        >
          <Button icon={<Icon icon={'date-range'} />}>Date Filter</Button>
        </Popover2>
      </Group>
      <TagsControl
        options={[{ value: 'excluded', label: 'Excluded' }]}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
    </Group>
  );
}

export const UncategorizedTransactionsDateFilter = () => {
  const initialValues = {};
  const handleSubmit = () => {};

  return (
    <AccountTransactionsDateFilterForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
};
