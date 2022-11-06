// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { CommercialDocBox } from '@/components';

import ReceiptDetailHeader from './ReceiptDetailHeader';
import ReceiptDetailTable from './ReceiptDetailTable';
import ReceiptDetailTableFooter from './ReceiptDetailTableFooter';
import ReceiptDetailFooter from './ReceiptDetailFooter';

export default function ReceiptDetailTab() {
  return (
    <ReceiptDetailsOverviewRoot>
      <CommercialDocBox>
        <ReceiptDetailHeader />
        <ReceiptDetailTable />
        <ReceiptDetailTableFooter />
        <ReceiptDetailFooter />
      </CommercialDocBox>
    </ReceiptDetailsOverviewRoot>
  );
}

const ReceiptDetailsOverviewRoot = styled.div``;
