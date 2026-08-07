import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Tag,
  Intent,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useCreditNoteDetailDrawerContext } from './CreditNoteDetailDrawerProvider';
import type { CreditNote } from '@bigcapital/sdk-ts';
import {
  Icon,
  FormattedMessage as T,
  TextOverviewTooltipCell,
  Choose,
} from '@/components';
import { getColumnWidth } from '@/utils';

interface CreditNoteMenuItemPayload {
  onReconcile: () => void;
}

interface CreditNoteMenuItemProps {
  payload: CreditNoteMenuItemPayload;
}

interface CreditNoteDetailsStatusProps {
  creditNote: Pick<CreditNote, 'isOpen' | 'isClosed' | 'isDraft'>;
}

export const useCreditNoteReadOnlyEntriesColumns = () => {
  // credit note details drawer context.
  const { creditNote } = useCreditNoteDetailDrawerContext();
  const entries = creditNote?.entries ?? [];

  return React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        width: 150,
        className: 'name',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: TextOverviewTooltipCell,
        className: 'description',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantityFormatted',
        width: getColumnWidth(entries, 'quantityFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rateFormatted',
        width: getColumnWidth(entries, 'rateFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'discount',
        Header: 'Discount',
        accessor: 'discountFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'discountFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('amount'),
        accessor: 'totalFormatted',
        width: getColumnWidth(entries, 'totalFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
    ],
    [entries],
  );
};

/**
 * Credit note more actions menu.
 */
export function CreditNoteMenuItem({
  payload: { onReconcile },
}: CreditNoteMenuItemProps) {
  return (
    <Popover
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      content={
        <Menu>
          <MenuItem
            onClick={onReconcile}
            text={<T id={'credit_note.action.reconcile_with_invoices'} />}
          />
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
}

/**
 * Credit note details status.
 */
export function CreditNoteDetailsStatus({
  creditNote,
}: CreditNoteDetailsStatusProps) {
  return (
    <Choose>
      <Choose.When condition={!!creditNote.isOpen}>
        <Tag intent={Intent.WARNING} round={true}>
          <T id={'open'} />
        </Tag>
      </Choose.When>

      <Choose.When condition={!!creditNote.isClosed}>
        <Tag intent={Intent.SUCCESS} round={true}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.When condition={!!creditNote.isDraft}>
        <Tag intent={Intent.NONE} round={true} minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.When>
    </Choose>
  );
}
