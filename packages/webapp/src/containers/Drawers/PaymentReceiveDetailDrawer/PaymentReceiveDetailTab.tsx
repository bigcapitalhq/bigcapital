import styled from 'styled-components';
import { PaymentReceiveDetailFooter } from './PaymentReceiveDetailFooter';
import { PaymentReceiveDetailHeader } from './PaymentReceiveDetailHeader';
import { PaymentReceiveDetailTable } from './PaymentReceiveDetailTable';
import { PaymentReceiveDetailTableFooter } from './PaymentReceiveDetailTableFooter';
import { CommercialDocBox } from '@/components';

/**
 * Payment receive - overview panel.
 */
export function PaymentReceiveDetailTab() {
  return (
    <PaymentReceiveDetailsTabPanelRoot>
      <CommercialDocBox>
        <PaymentReceiveDetailHeader />
        <PaymentReceiveDetailTable />
        <PaymentReceiveDetailTableFooter />
        <PaymentReceiveDetailFooter />
      </CommercialDocBox>
    </PaymentReceiveDetailsTabPanelRoot>
  );
}

const PaymentReceiveDetailsTabPanelRoot = styled.div``;
