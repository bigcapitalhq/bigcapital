import { Intent, MenuItem, Menu } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { BillLandedCostTransaction } from '@bigcapital/sdk-ts';
import { Icon } from '@/components';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

interface ActionsMenuProps {
  row: { original: BillLandedCostTransaction };
  payload: { onDelete: (row: BillLandedCostTransaction) => void };
}

interface FromTransactionCellProps {
  row: { original: BillLandedCostTransaction };
  payload: {
    onFromTranscationClick?: (row: BillLandedCostTransaction) => void;
  };
}

interface NameAccessorRow {
  name?: string;
  description?: string;
}

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onDelete },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_transaction')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
    </Menu>
  );
}

/**
 * From transaction table cell.
 */
export function FromTransactionCell({
  row: { original },
  payload: { onFromTranscationClick },
}: FromTransactionCellProps) {
  // Handle the link click
  const handleAnchorClick = () => {
    onFromTranscationClick && onFromTranscationClick(original);
  };

  return (
    <a href="#" onClick={handleAnchorClick}>
      {original.fromTransactionType} → {original.fromTransactionId}
    </a>
  );
}

/**
 * Name accessor.
 */
export const NameAccessor = (row: NameAccessorRow) => {
  return (
    <span className="name">
      <LabelName>{row.name}</LabelName>
      <LabelDescription>{row.description}</LabelDescription>
    </span>
  );
};

/**
 * Retrieve bill located landed cost table columns.
 */
export function useLocatedLandedCostColumns() {
  return React.useMemo(
    () => [
      {
        Header: intl.get('name'),
        accessor: NameAccessor,
        width: 150,
        textOverview: true,
      },
      {
        Header: intl.get('amount'),
        accessor: 'formattedAmount',
        width: 100,
        align: 'right',
        textOverview: true,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'from_transaction',
        Header: intl.get('From transaction'),
        Cell: FromTransactionCell,
        width: 100,
        textOverview: true,
      },
      {
        Header: intl.get('allocation_method'),
        accessor: 'allocationMethodFormatted',
        width: 100,
        textOverview: true,
      },
    ],
    [],
  );
}

const LabelName = styled.div``;

const LabelDescription = styled.div`
  font-size: 12px;
  margin-top: 2px;
  display: block;
  opacity: 0.75;
`;
