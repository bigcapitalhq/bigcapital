// @ts-nocheck
import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';

import { FormattedMessage as T } from '@/components';
import {
  FinancialSheetRoot,
  FinancialSheetFooterCurrentTime,
  FinancialSheetFooterBasis,
  FinancialSheetFooter,
  FinancialSheetAccountingBasis,
  FinancialSheetTable,
  FinancialSheetDate,
  FinancialSheetType,
  FinancialSheetTitle,
} from './StyledFinancialSheet';

/**
 * Financial sheet.
 * @returns {React.JSX}
 */
export function FinancialSheet({
  companyName,
  sheetType,
  dateText,
  children,
  accountingBasis,
  basis,
  minimal = false,
  fullWidth = false,
  currentDate = true,
  className,
}) {
  const methodsLabels = useMemo(
    () => ({
      cash: intl.get('cash'),
      accrual: intl.get('accrual'),
    }),
    [],
  );
  const getBasisLabel = useCallback((b) => methodsLabels[b], [methodsLabels]);
  const basisLabel = useMemo(
    () => getBasisLabel(basis),
    [getBasisLabel, basis],
  );
  const hasHead = companyName || sheetType || dateText;

  return (
    <FinancialSheetRoot
      minimal={minimal}
      fullWidth={fullWidth}
      className={className}
    >
      {hasHead && (
        <div>
          {companyName && <FinancialSheetTitle>{companyName}</FinancialSheetTitle>}
          {sheetType && <FinancialSheetType>{sheetType}</FinancialSheetType>}
          {dateText && <FinancialSheetDate>{dateText}</FinancialSheetDate>}
        </div>
      )}

      <FinancialSheetTable>{children}</FinancialSheetTable>
      <FinancialSheetAccountingBasis>
        {accountingBasis}
      </FinancialSheetAccountingBasis>

      <FinancialSheetFooter>
        {basisLabel && (
          <FinancialSheetFooterBasis>
            <T id={'accounting_basis'} /> {basisLabel}
          </FinancialSheetFooterBasis>
        )}
        {currentDate && (
          <FinancialSheetFooterCurrentTime>
            {moment().format('YYYY MMM DD  HH:MM')}
          </FinancialSheetFooterCurrentTime>
        )}
      </FinancialSheetFooter>
    </FinancialSheetRoot>
  );
}
