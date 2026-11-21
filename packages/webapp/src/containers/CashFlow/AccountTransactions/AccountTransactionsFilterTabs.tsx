import { useMemo } from 'react';
import styled from 'styled-components';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import { ContentTabs } from '@/components/ContentTabs/ContentTabs';

const AccountContentTabs = styled(ContentTabs)`
  margin: 15px 15px 0 15px;
`;

export function AccountTransactionsFilterTabs() {
  const { filterTab, setFilterTab, bankAccountMetaSummary } =
    useAccountTransactionsContext();

  const handleChange = (value: string) => {
    setFilterTab(value);
  };

  // Detarmines whether show the uncategorized transactions tab.
  const hasUncategorizedTransx = useMemo(
    () =>
      (bankAccountMetaSummary?.totalUncategorizedTransactions ?? 0) > 0 ||
      (bankAccountMetaSummary?.totalExcludedTransactions ?? 0) > 0 ||
      (bankAccountMetaSummary?.totalPendingTransactions ?? 0) > 0,
    [bankAccountMetaSummary],
  );

  return (
    <AccountContentTabs value={filterTab} onChange={handleChange}>
      <ContentTabs.Tab
        id={'dashboard'}
        title={'Dashboard'}
        description={'Account Summary'}
      />
      {hasUncategorizedTransx && (
        <ContentTabs.Tab
          id={'uncategorized'}
          title={
            <>
              <span style={{ color: 'var(--color-danger)' }}>
                {bankAccountMetaSummary?.totalUncategorizedTransactions ?? 0}
              </span>{' '}
              Uncategorized Transactions
            </>
          }
          description={'For Bank Statement'}
        />
      )}
      <ContentTabs.Tab
        id="all"
        title={'All Transactions'}
        description={'In Bigcapital'}
      />
    </AccountContentTabs>
  );
}
