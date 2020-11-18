import React from 'react';
import {
  Intent,
  Classes,
  Tooltip,
  Position,
  Tag,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { Choose, Money, If, Icon } from 'components';
import withAccountDetails from 'containers/Accounts/withAccountDetail';
import { compose } from 'utils';

const AmountPopoverContentLineRender = ({
  journalEntry,
  accountId,

  // #withAccountDetail
  account,
}) => {
  const isCredit = !!journalEntry.credit;
  const isDebit = !!journalEntry.debit;

  return (
    <Choose>
      <Choose.When condition={isDebit}>
        <div>
          C. <Money amount={journalEntry.debit} currency={'USD'} /> USD -{' '}
          {account.name} <If condition={account.code}>({account.code})</If>
        </div>
      </Choose.When>

      <Choose.When condition={isCredit}>
        <div class={'ml1'}>
          D. <Money amount={journalEntry.credit} currency={'USD'} /> USD -{' '}
          {account.name} <If condition={account.code}>({account.code})</If>
        </div>
      </Choose.When>
    </Choose>
  );
};

const AmountPopoverContentLine = compose(withAccountDetails)(
  AmountPopoverContentLineRender,
);

export function AmountPopoverContent({ journalEntries }) {
  const journalLinesProps = journalEntries.map((journalEntry) => ({
    journalEntry,
    accountId: journalEntry.account_id,
  }));

  return (
    <div>
      {journalLinesProps.map(({ journalEntry, accountId }) => (
        <AmountPopoverContentLine
          journalEntry={journalEntry}
          accountId={accountId}
        />
      ))}
    </div>
  );
}

/**
 * Status column accessor.
 */
export const StatusAccessor = (row) => {
  return (
    <Choose>
      <Choose.When condition={!!row.status}>
        <Tag minimal={true}>
          <T id={'published'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag minimal={true} intent={Intent.WARNING}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
};

/**
 * Note column accessor.
 */
export function NoteAccessor(row) {
  return (
    <If condition={row.description}>
      <Tooltip
        className={Classes.TOOLTIP_INDICATOR}
        content={row.description}
        position={Position.LEFT_TOP}
        hoverOpenDelay={50}
      >
        <Icon icon={'file-alt'} iconSize={16} />
      </Tooltip>
    </If>
  );
}