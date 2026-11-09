import { Divider } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import * as FO from 'fp-ts/Option';
import React, { useMemo } from 'react';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { AccountUncategorizedDateFilter } from './UncategorizedTransactions/AccountUncategorizedDateFilter';
import { Group } from '@/components';
import { TagsControl } from '@/components/TagsControl';
import { useAppQueryString } from '@/hooks';
import { when } from '@/utils/fp';

interface TagsControlOption {
  value: string;
  label: React.ReactNode;
}

export function AccountTransactionsUncategorizeFilter() {
  const { bankAccountMetaSummary } = useAccountTransactionsContext();
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const totalUncategorized =
    bankAccountMetaSummary?.totalUncategorizedTransactions ?? 0;
  const totalRecognized =
    bankAccountMetaSummary?.totalRecognizedTransactions ?? 0;

  const totalPending = bankAccountMetaSummary?.totalPendingTransactions ?? 0;

  const handleTabsChange = (value: string) => {
    setLocationQuery({ uncategorizedFilter: value });
  };

  const options = useMemo<TagsControlOption[]>(() => {
    const baseOptions: TagsControlOption[] = [
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
    ];

    return FF.pipe(
      baseOptions,
      when(
        () => totalPending > 0,
        (tags: TagsControlOption[]) => [
          ...tags,
          {
            value: 'pending',
            label: (
              <>
                Pending <strong>({totalPending})</strong>
              </>
            ),
          },
        ],
      ),
      FO.match(() => baseOptions, FF.identity),
    );
  }, [totalPending, totalRecognized, totalUncategorized]);

  return (
    <Group position={'apart'} style={{ marginBottom: 14 }}>
      <Group align={'stretch'} spacing={10}>
        <TagsControl
          // @ts-expect-error TagsControl types label as string but renders JSX at runtime
          options={options}
          value={locationQuery?.uncategorizedFilter || 'all'}
          onValueChange={handleTabsChange}
        />
        <Divider />
        <AccountUncategorizedDateFilter />
      </Group>

      <TagsControl
        options={[{ value: 'excluded', label: 'Excluded' }]}
        value={locationQuery?.uncategorizedFilter || 'all'}
        onValueChange={handleTabsChange}
      />
    </Group>
  );
}
