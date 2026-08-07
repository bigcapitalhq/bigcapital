import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { BillDetailActionsBar } from './BillDetailActionsBar';
import { BillDetailTab } from './BillDetailTab';
import { BillGLEntriesTable } from './BillGLEntriesTable';
import { BillPaymentTransactionTable } from './BillPaymentTransactions/BillPaymentTransactionTable';
import { LocatedLandedCostTable } from './LocatedLandedCostTable';
import { DrawerMainTabs } from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';
import { useAbilityContext } from '@/hooks/utils';

/**
 * Bill details tabs.
 */
function BillDetailsTabs() {
  const ability = useAbilityContext();

  return (
    <DrawerMainTabs
      renderActiveTabPanelOnly={true}
      defaultSelectedTabId="details"
    >
      <Tab
        title={intl.get('overview')}
        id={'details'}
        panel={<BillDetailTab />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<BillGLEntriesTable />}
      />
      {ability.can(PaymentMadeAction.View, AbilitySubject.PaymentMade) && (
        <Tab
          title={intl.get('payment_transactions')}
          id={'payment_transactions'}
          panel={<BillPaymentTransactionTable />}
        />
      )}
      <Tab
        title={intl.get('located_landed_cost')}
        id={'landed_cost'}
        panel={<LocatedLandedCostTable />}
      />
    </DrawerMainTabs>
  );
}

/**
 * Bill view detail.
 */
export function BillDetails() {
  return (
    <BillDetailsRoot>
      <BillDetailActionsBar />
      <BillDetailsTabs />
    </BillDetailsRoot>
  );
}

export const BillDetailsRoot = styled.div``;
