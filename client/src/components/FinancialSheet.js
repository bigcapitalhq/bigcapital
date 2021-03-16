import React, { useMemo, useCallback } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { FormattedMessage as T, useIntl } from 'react-intl';

import 'style/pages/FinancialStatements/FinancialSheet.scss';

import { If, LoadingIndicator, MODIFIER } from 'components';

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
  fullWidth = false,
  currentDate = true,
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
      {loading ? (
        <LoadingIndicator loading={loading} spinnerSize={34} />
      ) : (
        <div className={classnames('financial-sheet__inner')}>
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

          <div class="financial-sheet__footer">
            <If condition={basisLabel}>
              <span class="financial-sheet__basis">
                <T id={'accounting_basis'} /> {basisLabel}
              </span>
            </If>

            <If condition={currentDate}>
              <span class="financial-sheet__current-date">
                {moment().format('YYYY MMM DD  HH:MM')}
              </span>
            </If>
          </div>
        </div>
      )}
    </div>
  );
}
