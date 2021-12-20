import React from 'react';
import styled from 'styled-components';

import { CommercialDocBox } from 'components';

import PaymentReceiveDetailHeader from './PaymentReceiveDetailHeader';
import PaymentReceiveDetailTable from './PaymentReceiveDetailTable';
import PaymentReceiveDetailFooter from './PaymentReceiveDetailFooter';

/**
 * Payment receive - overview panel.
 * @returns {React.JSX}
 */
export default function PaymentReceiveDetailTab() {
  return (
    <PaymentReceiveDetailsTabPanelRoot>
      <CommercialDocBox>
        <PaymentReceiveDetailHeader />
        <PaymentReceiveDetailTable />
        <PaymentReceiveDetailFooter />
      </CommercialDocBox>
    </PaymentReceiveDetailsTabPanelRoot>
  );
}

const PaymentReceiveDetailsTabPanelRoot = styled.div``;
