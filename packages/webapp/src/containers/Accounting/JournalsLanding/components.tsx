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
import React from 'react';
import intl from 'react-intl-universal';
import type { ManualJournal } from '@bigcapital/sdk-ts';
import {
  Can,
  FormattedMessage as T,
  Choose,
  Money,
  If,
  Icon,
} from '@/components';
import { ManualJournalAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type ManualJournalEntryTableRow = {
  index: number;
  credit?: number;
  debit?: number;
  accountId: number;
  note?: string;
  account?: { id?: number; name?: string; code?: string };
};

export type ManualJournalTableRow = Omit<ManualJournal, 'entries'> & {
  entries: ManualJournalEntryTableRow[];
};

interface AmountPopoverContentLineProps {
  journalEntry: ManualJournalEntryTableRow;
  currencyCode?: string;
}

interface AmountPopoverContentProps {
  journalEntries: ManualJournalEntryTableRow[];
  currencyCode?: string;
}

interface ActionsMenuPayload {
  onPublish: (journal: ManualJournalTableRow) => void;
  onEdit: (journal: ManualJournalTableRow) => void;
  onDelete: (journal: ManualJournalTableRow) => void;
  onViewDetails: (journal: ManualJournalTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: ManualJournalTableRow };
  payload: ActionsMenuPayload;
}

/**
 * Amount accessor.
 */
export const AmountAccessor = (r: ManualJournalTableRow) => (
  <Tooltip
    content={
      <AmountPopoverContent
        journalEntries={r.entries}
        currencyCode={r.currencyCode}
      />
    }
    position={Position.RIGHT_TOP}
    boundary={'viewport'}
  >
    {r.formattedAmount}
  </Tooltip>
);

/**
 * Amount popover content line.
 */
export const AmountPopoverContentLine = ({
  journalEntry,
  currencyCode,
}: AmountPopoverContentLineProps) => {
  const isCredit = !!journalEntry.credit;
  const isDebit = !!journalEntry.debit;
  const { account } = journalEntry;

  return (
    <Choose>
      <Choose.When condition={isDebit}>
        <div>
          C. <Money amount={journalEntry.debit} currency={currencyCode} /> -{' '}
          {account?.name} <If condition={!!account?.code}>({account?.code})</If>
        </div>
      </Choose.When>

      <Choose.When condition={isCredit}>
        <div>
          D. <Money amount={journalEntry.credit} currency={currencyCode} /> -{' '}
          {account?.name} <If condition={!!account?.code}>({account?.code})</If>
        </div>
      </Choose.When>
    </Choose>
  );
};

/**
 * Amount popover content.
 */
export function AmountPopoverContent({
  journalEntries,
  currencyCode,
}: AmountPopoverContentProps) {
  return (
    <div>
      {journalEntries.map((journalEntry) => (
        <AmountPopoverContentLine
          key={journalEntry.index}
          journalEntry={journalEntry}
          currencyCode={currencyCode}
        />
      ))}
    </div>
  );
}

/**
 * Publish column accessor.
 */
export const StatusAccessor = (row: ManualJournalTableRow) => {
  return (
    <Choose>
      <Choose.When condition={!!row.isPublished}>
        <Tag round minimal>
          <T id={'published'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag intent={Intent.WARNING} round minimal>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
};

/**
 * Note column accessor.
 */
export function NoteAccessor(row: ManualJournalTableRow) {
  return (
    <If condition={!!row.description}>
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
export const ActionsCell = (props: ActionsMenuProps) => {
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
}: ActionsMenuProps) => {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={ManualJournalAction.Edit} a={AbilitySubject.ManualJournal}>
        <MenuDivider />
        <If condition={!original.isPublished}>
          <MenuItem
            icon={<Icon icon="arrow-to-top" />}
            text={intl.get('publish_journal')}
            onClick={safeCallback(onPublish, original)}
          />
        </If>
      </Can>
      <Can I={ManualJournalAction.Edit} a={AbilitySubject.ManualJournal}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_journal')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={ManualJournalAction.Delete} a={AbilitySubject.ManualJournal}>
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_journal')}
          icon={<Icon icon="trash-16" iconSize={16} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </Can>
    </Menu>
  );
};
