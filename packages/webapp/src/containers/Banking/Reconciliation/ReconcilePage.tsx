import React from 'react';
import intl from 'react-intl-universal';
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
        <PageHeader>
          <Title>{intl.get('banking.reconciliation.page_title')}</Title>
          <Subtitle>
            {intl.get('banking.reconciliation.page_subtitle')}
          </Subtitle>
        </PageHeader>

        <ReconcileWizard />
      </DashboardPageContent>
    </ReconciliationTheme>
  );
}

const PageHeader = styled.div`
  margin: 4px 0 16px;
`;

const Title = styled.h2`
  margin: 0 0 2px;
  font-size: 20px;
  font-weight: 600;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: var(--x-recon-text-muted);
`;
