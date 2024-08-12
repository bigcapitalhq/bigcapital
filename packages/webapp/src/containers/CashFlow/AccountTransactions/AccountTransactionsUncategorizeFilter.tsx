// @ts-nocheck
import * as R from 'ramda';
import { useMemo } from 'react';
import { useAppQueryString } from '@/hooks';
import { Group } from '@/components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { TagsControl } from '@/components/TagsControl';

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
      <TagsControl
        options={options}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
      <TagsControl
        options={[{ value: 'excluded', label: 'Excluded' }]}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
    </Group>
  );
}
