import React from 'react';
import styled from 'styled-components';
import { ReceiptDetailFooter } from './ReceiptDetailFooter';
import { ReceiptDetailHeader } from './ReceiptDetailHeader';
import { ReceiptDetailTable } from './ReceiptDetailTable';
import { ReceiptDetailTableFooter } from './ReceiptDetailTableFooter';
import { CommercialDocBox } from '@/components';

export function ReceiptDetailTab() {
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
