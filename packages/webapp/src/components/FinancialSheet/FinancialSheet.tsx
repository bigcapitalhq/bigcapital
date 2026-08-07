import moment from 'moment';
import React, { useMemo, useCallback } from 'react';
import intl from 'react-intl-universal';
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
import { FormattedMessage as T } from '@/components';

interface FinancialSheetProps {
  companyName?: string;
  sheetType?: string;
  dateText?: string;
  children?: React.ReactNode;
  accountingBasis?: React.ReactNode;
  basis?: 'cash' | 'accrual';
  minimal?: boolean;
  fullWidth?: boolean;
  currentDate?: boolean;
  className?: string;
}

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
}: FinancialSheetProps) {
  const methodsLabels = useMemo(
    () => ({
      cash: intl.get('cash'),
      accrual: intl.get('accrual'),
    }),
    [],
  );
  const getBasisLabel = useCallback(
    (b: 'cash' | 'accrual') => methodsLabels[b],
    [methodsLabels],
  );
  const basisLabel = useMemo(
    () => (basis ? getBasisLabel(basis) : undefined),
    [getBasisLabel, basis],
  );
  const hasHead = companyName || sheetType || dateText;

  return (
    <FinancialSheetRoot
      $minimal={minimal}
      $fullWidth={fullWidth}
      className={className}
    >
      {hasHead && (
        <div>
          {companyName && (
            <FinancialSheetTitle>{companyName}</FinancialSheetTitle>
          )}
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
            {moment().format('YYYY MMM DD HH:mm')}
          </FinancialSheetFooterCurrentTime>
        )}
      </FinancialSheetFooter>
    </FinancialSheetRoot>
  );
}
