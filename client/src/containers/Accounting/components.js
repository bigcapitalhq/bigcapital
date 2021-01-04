import React from 'react';
import { Intent, Classes, Tooltip, Position, Tag, Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { Choose, Money, If, Icon, Hint } from 'components';
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
        <div>
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
 * publish column accessor.
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

// Contact header cell.
export function ContactHeaderCell() {
  return (
    <>
      <T id={'contact'} />
      <Hint
        content={<T id={'contact_column_hint'} />}
        position={Position.LEFT_BOTTOM}
      />
    </>
  );
}

// Actions cell renderer.
export const ActionsCellRenderer = ({
  row: { index },
  column: { id },
  cell: { value: initialValue },
  data,
  payload,
}) => {
  if (data.length <= index + 1) {
    return '';
  }
  const onClickRemoveRole = () => {
    payload.removeRow(index);
  };
  return (
    <Tooltip content={<T id={'remove_the_line'} />} position={Position.LEFT}>
      <Button
        icon={<Icon icon="times-circle" iconSize={14} />}
        iconSize={14}
        className="ml2"
        minimal={true}
        intent={Intent.DANGER}
        onClick={onClickRemoveRole}
      />
    </Tooltip>
  );
};

// Total text cell renderer.
export const TotalAccountCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return <span>{'Total USD'}</span>;
  }
  return chainedComponent(props);
};

// Total credit/debit cell renderer.
export const TotalCreditDebitCellRenderer = (chainedComponent, type) => (
  props,
) => {
  if (props.data.length === props.row.index + 1) {
    const total = props.data.reduce((total, entry) => {
      const amount = parseInt(entry[type], 10);
      const computed = amount ? total + amount : total;

      return computed;
    }, 0);

    return <span><Money amount={total} currency={'USD'} /></span>;
  }
  return chainedComponent(props);
};

export const NoteCellRenderer = (chainedComponent) => (props) => {
  if (props.data.length === props.row.index + 1) {
    return '';
  }
  return chainedComponent(props);
};
