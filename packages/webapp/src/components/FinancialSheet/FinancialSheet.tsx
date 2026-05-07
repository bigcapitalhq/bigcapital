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
  dateFormat,
  minimal = false,
  fullWidth = false,
  currentDate = true,
  className,
}) {
  // Tenant-level dateFormat (from report meta); fall back to a US-friendly
  // default. Append a time portion since the footer shows when the report
  // was generated.
  const footerDateFormat = dateFormat
    ? `${dateFormat} HH:mm`
    : 'MMM DD, YYYY HH:mm';
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

  return (
    <FinancialSheetRoot
      minimal={minimal}
      fullWidth={fullWidth}
      className={className}
    >
      {companyName && <FinancialSheetTitle>{companyName}</FinancialSheetTitle>}
      {sheetType && <FinancialSheetType>{sheetType}</FinancialSheetType>}

      {dateText && <FinancialSheetDate>{dateText}</FinancialSheetDate>}

      <FinancialSheetTable>{children}</FinancialSheetTable>
      <FinancialSheetAccountingBasis>
        {accountingBasis}
      </FinancialSheetAccountingBasis>

      <FinancialSheetFooter>
        {basisLabel && (
          <FinancialSheetFooterBasis>
            <T id={'accounting_basis'} />{' '}{basisLabel}
          </FinancialSheetFooterBasis>
        )}
        {currentDate && (
          <FinancialSheetFooterCurrentTime>
            {moment().format(footerDateFormat)}
          </FinancialSheetFooterCurrentTime>
        )}
      </FinancialSheetFooter>
    </FinancialSheetRoot>
  );
}
