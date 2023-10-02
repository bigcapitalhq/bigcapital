// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem, Menu, Button, Position, Intent } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { Align, CellType, Features } from '@/constants';
import { Hint, Icon, FormattedMessage as T } from '@/components';
import { formattedAmount } from '@/utils';
import {
  InputGroupCell,
  MoneyFieldCell,
  ItemsListCell,
  PercentFieldCell,
  NumericInputCell,
  CheckBoxFieldCell,
  ProjectBillableEntriesCell,
} from '@/components/DataTableCells';
import { useFeatureCan } from '@/hooks/state';
import { TaxRatesSuggestInputCell } from '@/components/TaxRates/TaxRatesSuggestInputCell';
import { useItemEntriesTableContext } from './ItemEntriesTableProvider';

/**
 * Item header cell.
 */
export function ItemHeaderCell() {
  return (
    <>
      <T id={'product_and_service'} />
      <Hint
        content={<T id={'item_entries.products_services.hint'} />}
        tooltipProps={{ boundary: 'window', position: Position.RIGHT }}
      />
    </>
  );
}

/**
 * Actions cell renderer component.
 */
export function ActionsCellRenderer({
  row: { index },
  payload: { removeRow },
}) {
  const onRemoveRole = () => {
    removeRow(index);
  };
  const exampleMenu = (
    <Menu>
      <MenuItem
        intent={Intent.DANGER}
        onClick={onRemoveRole}
        text={<T id={'item_entries.remove_row'} />}
      />
    </Menu>
  );

  return (
    <Popover2 content={exampleMenu} placement="left-start">
      <Button
        icon={<Icon icon={'more-13'} iconSize={13} />}
        iconSize={14}
        className="m12"
        minimal={true}
      />
    </Popover2>
  );
}
ActionsCellRenderer.cellType = CellType.Button;

/**
 * Total accessor.
 */
export function TotalCell({ payload: { currencyCode }, value }) {
  return <span>{formattedAmount(value, currencyCode, { noZero: true })}</span>;
}

/**
 * Landed cost header cell.
 */
const LandedCostHeaderCell = () => {
  return (
    <>
      <T id={'landed'} />
      <Hint content={<T id={'item_entries.landed.hint'} />} />
    </>
  );
};

/**
 * Retrieve editable items entries columns.
 */
export function useEditableItemsEntriesColumns() {
  const { featureCan } = useFeatureCan();
  const { landedCost, enableTaxRates } = useItemEntriesTableContext();

  const isProjectsFeatureEnabled = featureCan(Features.Projects);

  return React.useMemo(
    () => [
      {
        id: 'item_id',
        Header: ItemHeaderCell,
        accessor: 'item_id',
        Cell: ItemsListCell,
        disableSortBy: true,
        width: 130,
        className: 'item',
        fieldProps: { allowCreate: true },
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: InputGroupCell,
        disableSortBy: true,
        className: 'description',
        width: 120,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        Cell: NumericInputCell,
        disableSortBy: true,
        width: 70,
        align: Align.Right,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 70,
        align: Align.Right,
      },
      ...(enableTaxRates
        ? [
            {
              Header: 'Tax rate',
              accessor: 'tax_rate_id',
              Cell: TaxRatesSuggestInputCell,
              disableSortBy: true,
              width: 110,
            },
          ]
        : []),
      {
        Header: intl.get('discount'),
        accessor: 'discount',
        Cell: PercentFieldCell,
        disableSortBy: true,
        width: 60,
        align: Align.Right,
      },
      {
        Header: intl.get('total'),
        accessor: 'amount',
        Cell: TotalCell,
        disableSortBy: true,
        width: 100,
        align: Align.Right,
      },
      ...(landedCost
        ? [
            {
              Header: LandedCostHeaderCell,
              accessor: 'landed_cost',
              Cell: CheckBoxFieldCell,
              width: 100,
              disabledAccessor: 'landed_cost_disabled',
              disableSortBy: true,
              disableResizing: true,
              align: Align.Center,
            },
          ]
        : []),
      ...(isProjectsFeatureEnabled
        ? [
            {
              Header: '',
              accessor: 'invoicing',
              Cell: ProjectBillableEntriesCell,
              disableSortBy: true,
              disableResizing: true,
              width: 45,
              align: Align.Center,
            },
          ]
        : []),
      {
        Header: '',
        accessor: 'action',
        Cell: ActionsCellRenderer,
        disableSortBy: true,
        disableResizing: true,
        width: 45,
        align: Align.Center,
      },
    ],
    [],
  );
}
