import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { FormattedMessage as T, useIntl } from 'react-intl';

import { If, LoadingIndicator, MODIFIER } from 'components';

import 'style/pages/FinancialStatements/FinancialSheet.scss';

export default function FinancialSheet({
  companyName,
  sheetType,
  fromDate,
  toDate,
  asDate,
  children,
  accountingBasis,
  name,
  loading,
  className,
  basis,
  minimal = false,
  fullWidth = false
}) {
  const { formatMessage } = useIntl();
  const format = 'DD MMMM YYYY';
  const formattedFromDate = useMemo(() => moment(fromDate).format(format), [
    fromDate,
  ]);
  const formattedToDate = useMemo(() => moment(toDate).format(format), [
    toDate,
  ]);
  const formattedAsDate = useMemo(() => moment(asDate).format(format), [
    asDate,
  ]);

  const nameModifer = name ? `financial-sheet--${name}` : '';
  const methodsLabels = useMemo(
    () => ({
      cash: formatMessage({ id: 'cash' }),
      accrual: formatMessage({ id: 'accrual' }),
    }),
    [formatMessage],
  );
  const getBasisLabel = useCallback((b) => methodsLabels[b], [methodsLabels]);
  const basisLabel = useMemo(() => getBasisLabel(basis), [
    getBasisLabel,
    basis,
  ]);

  return (
    <div
      className={classnames('financial-sheet', nameModifer, className, {
        [MODIFIER.FINANCIAL_SHEET_MINIMAL]: minimal,
        'is-full-width': fullWidth,
      })}
    >
      <LoadingIndicator loading={loading} spinnerSize={34} />

      <div
        className={classnames('financial-sheet__inner', {
          'is-loading': loading,
        })}
      >
        <If condition={!!companyName}>
          <h1 class="financial-sheet__title">{companyName}</h1>
        </If>

        <If condition={!!sheetType}>
          <h6 class="financial-sheet__sheet-type">{sheetType}</h6>
        </If>

        <div class="financial-sheet__date">
          <If condition={asDate}>
            <T id={'as'} /> {formattedAsDate}
          </If>

          <If condition={fromDate && toDate}>
            <T id={'from'} /> {formattedFromDate} | <T id={'to'} />{' '}
            {formattedToDate}
          </If>
        </div>

        <div class="financial-sheet__table">{children}</div>
        <div class="financial-sheet__accounting-basis">{accountingBasis}</div>

        {basisLabel && (
          <div class="financial-sheet__basis">
            <T id={'accounting_basis'} /> {basisLabel}
          </div>
        )}
      </div>
    </div>
  );
}
