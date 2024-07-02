// @ts-nocheck
import styled from 'styled-components';
import { CategorizeTransactionBoot } from './CategorizeTransactionBoot';
import { CategorizeTransactionForm } from './CategorizeTransactionForm';
import { useCategorizeTransactionTabsBoot } from '@/containers/CashFlow/CategorizeTransactionAside/CategorizeTransactionTabsBoot';

export function CategorizeTransactionContent() {
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

const CategorizeTransactionDrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;
