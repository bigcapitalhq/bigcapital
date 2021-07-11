import React from 'react';
import {
  Intent,
  Classes,
  Tooltip,
  Position,
  Tag,
  Button,
  MenuItem,
  Menu,
  MenuDivider,
  Popover,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import moment from 'moment';
import { Choose, Money, If, Icon } from 'components';
import { safeCallback } from 'utils';
import intl from 'react-intl-universal';

/**
 * Amount accessor.
 */
export const AmountAccessor = (r) => (
  <Tooltip
    content={
      <AmountPopoverContent
        journalEntries={r.entries}
        currencyCode={r.currency_code}
      />
    }
    position={Position.RIGHT_TOP}
    boundary={'viewport'}
  >
    {r.amount_formatted}
  </Tooltip>
);

/**
 * Amount popover content line.
 */
export const AmountPopoverContentLine = ({ journalEntry, currencyCode }) => {
  const isCredit = !!journalEntry.credit;
  const isDebit = !!journalEntry.debit;
  const { account } = journalEntry;

  return (
    <Choose>
      <Choose.When condition={isDebit}>
        <div>
          C. <Money amount={journalEntry.debit} currency={currencyCode} /> -{' '}
          {account.name} <If condition={account.code}>({account.code})</If>
        </div>
      </Choose.When>

      <Choose.When condition={isCredit}>
        <div>
          D. <Money amount={journalEntry.credit} currency={currencyCode} /> -{' '}
          {account.name} <If condition={account.code}>({account.code})</If>
        </div>
      </Choose.When>
    </Choose>
  );
};

/**
 * Amount popover content.
 */
export function AmountPopoverContent({ journalEntries, currencyCode }) {
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
          currencyCode={currencyCode}
        />
      ))}
    </div>
  );
}

/**
 * Publish column accessor.
 */
export const StatusAccessor = (row) => {
  return (
    <Choose>
      <Choose.When condition={!!row.is_published}>
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
 * Date accessor.
 */
export const DateAccessor = (row) => {
  return moment(row.date).format('YYYY MMM DD');
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

/**
 * Table actions cell.
 */
export const ActionsCell = (props) => {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
};

/**
 * Actions menu of the table.
 */
export const ActionsMenu = ({
  payload: { onPublish, onEdit, onDelete, onViewDetails },
  row: { original },
}) => {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <MenuDivider />
      <If condition={!original.is_published}>
        <MenuItem
          icon={<Icon icon="arrow-to-top" />}
          text={intl.get('publish_journal')}
          onClick={safeCallback(onPublish, original)}
        />
      </If>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_journal')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={intl.get('delete_journal')}
        icon={<Icon icon="trash-16" iconSize={16} />}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
    </Menu>
  );
};
