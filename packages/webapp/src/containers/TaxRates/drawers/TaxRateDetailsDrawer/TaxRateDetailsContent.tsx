// @ts-nocheck
import React from 'react';
import TaxRateDetailsContentActionsBar from './TaxRateDetailsContentActionsBar';
import { TaxRateDetailsContentBoot } from './TaxRateDetailsContentBoot';
import { DrawerBody, DrawerHeaderContent } from '@/components';
import TaxRateDetailsContentDetails from './TaxRateDetailsContentDetails';
import { DRAWERS } from '@/constants/drawers';

interface TaxRateDetailsContentProps {
  taxRateid: number;
}

export default function TaxRateDetailsContent({
  taxRateId,
}: TaxRateDetailsContentProps) {
  return (
    <TaxRateDetailsContentBoot taxRateId={taxRateId}>
      <DrawerHeaderContent
        name={DRAWERS.TAX_RATE_DETAILS}
        title={'Tax Rate Details'}
      />
      <TaxRateDetailsContentActionsBar />

      <DrawerBody>
        <TaxRateDetailsContentDetails />
      </DrawerBody>
    </TaxRateDetailsContentBoot>
  );
}
