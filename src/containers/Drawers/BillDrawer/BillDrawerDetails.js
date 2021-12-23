import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { Can, DrawerMainTabs } from 'components';
import {
  PaymentMadeAction,
  AbilitySubject,
} from '../../../common/abilityOption';
import BillDetailTab from './BillDetailTab';
import LocatedLandedCostTable from './LocatedLandedCostTable';
import BillGLEntriesTable from './BillGLEntriesTable';
import BillPaymentTransactionTable from './BillPaymentTransactions/BillPaymentTransactionTable';
import BillDetailActionsBar from './BillDetailActionsBar';

/**
 * Bill details tabs.
 */
function BillDetailsTabs() {
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
      {/* <Can I={PaymentMadeAction.View} a={AbilitySubject.PaymentMade}> */}
        <Tab
          title={intl.get('payment_transactions')}
          id={'payment_transactions'}
          panel={<BillPaymentTransactionTable />}
        />
      {/* </Can> */}
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
export default function BillDetails() {
  return (
    <BillDetailsRoot>
      <BillDetailActionsBar />
      <BillDetailsTabs />
    </BillDetailsRoot>
  );
}

export const BillDetailsRoot = styled.div``;
