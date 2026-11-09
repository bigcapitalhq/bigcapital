import React from 'react';
import intl from 'react-intl-universal';
import { EstimateFormHeader as EstimateFormHeaderFields } from './EstimateFormHeaderFields';
import { useEstimateTotalFormatted } from './utils';
import { Group, PageFormBigNumber } from '@/components';
import { useIsDarkMode } from '@/hooks/useDarkMode';

// Estimate form top header.
export function EstimateFormHeader() {
  const isDarkMode = useIsDarkMode();

  return (
    <Group
      position="apart"
      align={'flex-start'}
      p="25px 32px"
      bg="var(--x-estimate-form-header-background)"
      borderBottom="1px solid var(--x-estimate-form-header-border)"
      style={
        {
          '--x-estimate-form-header-background': isDarkMode
            ? 'var(--color-dark-gray1)'
            : 'var(--color-white)',
          '--x-estimate-form-header-border': isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : '#d2dce2',
        } as React.CSSProperties
      }
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
