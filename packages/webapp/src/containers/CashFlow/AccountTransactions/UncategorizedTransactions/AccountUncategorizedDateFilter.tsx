import { Classes, Popover, Position } from '@blueprintjs/core';
import moment from 'moment';
import { useState } from 'react';
import { withBanking } from '../../withBanking';
import { withBankingActions } from '../../withBankingActions';
import { AccountTransactionsDateFilterForm } from '../AccountTransactionsDateFilter';
import { TagButton } from './TagButton';
import type { WithBankingProps } from '../../withBanking';
import type { WithBankingActionsProps } from '../../withBankingActions';
import type { UncategorizedTransactionsFilter } from '../../withBankingActions';
import type { AccountTransactionsDateFilterFormValues } from '../AccountTransactionsDateFilter';
import type { FormikConfig, FormikHelpers } from 'formik';
import { Box, Icon } from '@/components';
import { compose } from '@/utils';

interface AccountUncategorizedDateFilterRootProps
  extends Pick<WithBankingProps, 'uncategorizedTransactionsFilter'> {}

function AccountUncategorizedDateFilterRoot({
  uncategorizedTransactionsFilter,
}: AccountUncategorizedDateFilterRootProps) {
  const fromDate = uncategorizedTransactionsFilter?.fromDate;
  const toDate = uncategorizedTransactionsFilter?.toDate;

  const fromDateFormatted = fromDate
    ? moment(fromDate).isSame(moment().format('YYYY'), 'year')
      ? moment(fromDate).format('MMM, DD')
      : moment(fromDate).format('MMM, DD, YYYY')
    : '';
  const toDateFormatted = toDate
    ? moment(toDate).isSame(moment().format('YYYY'), 'year')
      ? moment(toDate).format('MMM, DD')
      : moment(toDate).format('MMM, DD, YYYY')
    : '';

  const buttonText =
    fromDate && toDate
      ? `Date: ${fromDateFormatted} → ${toDateFormatted}`
      : 'Date Filter';

  // Popover open state.
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Handle the filter form submitting.
  const handleSubmit = () => {
    setIsOpen(false);
  };

  return (
    <Popover
      content={
        <Box style={{ padding: 18 }}>
          <UncategorizedTransactionsDateFilter onSubmit={handleSubmit} />
        </Box>
      }
      position={Position.RIGHT}
      popoverClassName={Classes.POPOVER_CONTENT}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <TagButton
        outlined
        icon={<Icon icon={'date-range'} />}
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonText}
      </TagButton>
    </Popover>
  );
}

export const AccountUncategorizedDateFilter = compose(
  withBanking(({ uncategorizedTransactionsFilter }) => ({
    uncategorizedTransactionsFilter,
  })),
)(AccountUncategorizedDateFilterRoot);

interface UncategorizedTransactionsDateFilterProps
  extends Pick<WithBankingActionsProps, 'setUncategorizedTransactionsFilter'>,
    Pick<WithBankingProps, 'uncategorizedTransactionsFilter'> {
  onSubmit?: (values: UncategorizedTransactionsFilter) => void;
}

const toDateFilterString = (value: string | Date | null): string | undefined =>
  value == null
    ? undefined
    : typeof value === 'string'
      ? value
      : value.toISOString();

export const UncategorizedTransactionsDateFilter = compose(
  withBankingActions,
  withBanking(({ uncategorizedTransactionsFilter }) => ({
    uncategorizedTransactionsFilter,
  })),
)(({
  // #withBankingActions
  setUncategorizedTransactionsFilter,

  // #withBanking
  uncategorizedTransactionsFilter,

  // #ownProps
  onSubmit,
}: UncategorizedTransactionsDateFilterProps) => {
  const initialValues: AccountTransactionsDateFilterFormValues = {
    period: 'all_dates',
    fromDate: uncategorizedTransactionsFilter?.fromDate ?? '',
    toDate: uncategorizedTransactionsFilter?.toDate ?? '',
  };

  const handleSubmit: FormikConfig<AccountTransactionsDateFilterFormValues>['onSubmit'] =
    (
      values: AccountTransactionsDateFilterFormValues,
      _helpers: FormikHelpers<AccountTransactionsDateFilterFormValues>,
    ) => {
      const filter: UncategorizedTransactionsFilter = {
        fromDate: toDateFilterString(values.fromDate),
        toDate: toDateFilterString(values.toDate),
      };
      setUncategorizedTransactionsFilter(filter);
      onSubmit?.(filter);
    };

  return (
    <AccountTransactionsDateFilterForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
});
