// @ts-nocheck
import styled from 'styled-components';
import { DrawerBody } from '@/components';
import { CategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { CategorizeTransactionForm } from './CategorizeTransactionForm';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';

export function CategorizeTransactionContent({}) {
  const { uncategorizedTransactionId } = useCategorizeTransactionTabsBoot();

  return (
    <CategorizeTransactionBoot
      uncategorizedTransactionId={uncategorizedTransactionId}
    >
      <CategorizeTransactionDrawerBody>
        <CategorizeTransactionForm />
      </CategorizeTransactionDrawerBody>
    </CategorizeTransactionBoot>
  );
}

const CategorizeTransactionDrawerBody = styled(DrawerBody)`
  padding: 20px;
  background-color: #fff;
`;
