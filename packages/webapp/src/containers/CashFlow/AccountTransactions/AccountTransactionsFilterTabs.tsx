// @ts-nocheck
import styled from 'styled-components';
import { ContentTabs } from '@/components/ContentTabs/ContentTabs';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';

const AccountContentTabs = styled(ContentTabs)`
  margin: 15px 15px 0 15px;
`;

export function AccountTransactionsFilterTabs() {
  const { filterTab, setFilterTab } = useAccountTransactionsContext();

  const handleChange = (value) => {
    setFilterTab(value);
  };

  return (
    <AccountContentTabs value={filterTab} onChange={handleChange}>
      <ContentTabs.Tab
        id={'dashboard'}
        title={'Dashboard'}
        description={'Account Summary'}
      />
      <ContentTabs.Tab
        id={'uncategorized'}
        title={
          <>
            <span style={{ color: '#ff0000' }}>20</span> Uncategorized
            Transactions
          </>
        }
        description={'For Bank Statement'}
      />
      <ContentTabs.Tab
        id="all"
        title={'All Transactions'}
        description={'In Bigcapital'}
      />
    </AccountContentTabs>
  );
}
