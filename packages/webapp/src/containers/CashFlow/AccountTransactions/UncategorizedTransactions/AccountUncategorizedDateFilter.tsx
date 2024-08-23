// @ts-nocheck
import { useState } from 'react';
import * as R from 'ramda';
import moment from 'moment';
import { Box, Icon } from '@/components';
import { Classes, Popover, Position } from '@blueprintjs/core';
import { withBankingActions } from '../../withBankingActions';
import { withBanking } from '../../withBanking';
import { AccountTransactionsDateFilterForm } from '../AccountTransactionsDateFilter';
import { TagButton } from './TagButton';

function AccountUncategorizedDateFilterRoot({
  uncategorizedTransactionsFilter,
}) {
  const fromDate = uncategorizedTransactionsFilter?.fromDate;
  const toDate = uncategorizedTransactionsFilter?.toDate;

  const fromDateFormatted = moment(fromDate).isSame(
    moment().format('YYYY'),
    'year',
  )
    ? moment(fromDate).format('MMM, DD')
    : moment(fromDate).format('MMM, DD, YYYY');
  const toDateFormatted = moment(toDate).isSame(moment().format('YYYY'), 'year')
    ? moment(toDate).format('MMM, DD')
    : moment(toDate).format('MMM, DD, YYYY');

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
        outline
        icon={<Icon icon={'date-range'} />}
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonText}
      </TagButton>
    </Popover>
  );
}

export const AccountUncategorizedDateFilter = R.compose(
  withBanking(({ uncategorizedTransactionsFilter }) => ({
    uncategorizedTransactionsFilter,
  })),
)(AccountUncategorizedDateFilterRoot);

export const UncategorizedTransactionsDateFilter = R.compose(
  withBankingActions,
  withBanking(({ uncategorizedTransactionsFilter }) => ({
    uncategorizedTransactionsFilter,
  })),
)(
  ({
    // #withBankingActions
    setUncategorizedTransactionsFilter,

    // #withBanking
    uncategorizedTransactionsFilter,

    // #ownProps
    onSubmit,
  }) => {
    const initialValues = {
      ...uncategorizedTransactionsFilter,
    };

    const handleSubmit = (values) => {
      setUncategorizedTransactionsFilter({
        fromDate: values.fromDate,
        toDate: values.toDate,
      });
      onSubmit && onSubmit(values);
    };

    return (
      <AccountTransactionsDateFilterForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    );
  },
);
