import React from 'react';
import styled from 'styled-components';
import { ReconcileWizard } from './ReconcileWizard';
import { DashboardPageContent } from '@/components';
import { ReconciliationTheme } from '@/containers/CashFlow/AccountTransactions/Reconciliation/styles';

/**
 * Bank reconciliation landing page.
 */
export function ReconcilePage() {
  return (
    <ReconciliationTheme>
      <DashboardPageContent>
        <CardWrapper>
          <ReconcileWizard />
        </CardWrapper>
      </DashboardPageContent>
    </ReconciliationTheme>
  );
}

const CardWrapper = styled.div`
  margin: 40px 28px;
  max-width: 800px;
`;
