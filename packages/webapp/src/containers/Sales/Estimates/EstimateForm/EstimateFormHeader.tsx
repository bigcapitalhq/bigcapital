// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import EstimateFormHeaderFields from './EstimateFormHeaderFields';
import { Group, PageFormBigNumber } from '@/components';
import { useEstimateTotalFormatted } from './utils';

// Estimate form top header.
function EstimateFormHeader() {
  return (
    <Group
      position="apart"
      align={'flex-start'}
      bg="white"
      p="25px 32px"
      borderBottom="1px solid #d2dce2"
    >
      <EstimateFormHeaderFields />
      <EstimateFormBigTotal />
    </Group>
  );
}

/**
 * Big total of estimate form header.
 * @returns {React.ReactNode}
 */
function EstimateFormBigTotal() {
  const totalFormatted = useEstimateTotalFormatted();

  return (
    <PageFormBigNumber label={intl.get('amount')} amount={totalFormatted} />
  );
}

export default EstimateFormHeader;
