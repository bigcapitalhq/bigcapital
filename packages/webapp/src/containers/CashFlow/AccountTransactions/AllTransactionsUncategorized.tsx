// @ts-nocheck
import styled from 'styled-components';

import '@/style/pages/CashFlow/AccountTransactions/List.scss';

import AccountTransactionsUncategorizedTable from './AccountTransactionsUncategorizedTable';
import { AccountUncategorizedTransactionsBoot } from './AllTransactionsUncategorizedBoot';

const Box = styled.div`
  margin: 30px 15px;
`;

const CashflowTransactionsTableCard = styled.div`
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  padding: 30px 18px;
  background: #fff;
  flex: 0 1;
`;

export default function AllTransactionsUncategorized() {
  return (
    <AccountUncategorizedTransactionsBoot>
      <Box>
        <CashflowTransactionsTableCard>
          <AccountTransactionsUncategorizedTable />
        </CashflowTransactionsTableCard>
      </Box>
    </AccountUncategorizedTransactionsBoot>
  );
}
