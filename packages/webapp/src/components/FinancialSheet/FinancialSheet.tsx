// @ts-nocheck
import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';

import { If, FormattedMessage as T } from '@/components';
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
  fromDate,
  toDate,
  asDate,
  children,
  accountingBasis,
  basis,
  minimal = false,
  fullWidth = false,
  currentDate = true,
  className,
}) {
  const format = 'DD MMMM YYYY';
  const formattedFromDate = useMemo(
    () => moment(fromDate).format(format),
    [fromDate],
  );
  const formattedToDate = useMemo(
    () => moment(toDate).format(format),
    [toDate],
  );
  const formattedAsDate = useMemo(
    () => moment(asDate).format(format),
    [asDate],
  );
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

      <FinancialSheetDate>
        <If condition={asDate}>
          <T id={'as'} /> {formattedAsDate}
        </If>
        <If condition={fromDate && toDate}>
          <T id={'from'} /> {formattedFromDate} | <T id={'to'} />{' '}
          {formattedToDate}
        </If>
      </FinancialSheetDate>

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
