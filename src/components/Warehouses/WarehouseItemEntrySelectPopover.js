import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { DataTable } from 'components';
import { RadioTableCell } from 'components/DataTableCells';
import { compose, updateTableCell } from 'utils';

import { TableStyle } from 'common';

const Classes = {
  WAREHOUSE_ITEM_ENTRY_POPOVER: 'warehouse-item-entry-popover',
};
/**
 * Retrieve  warehouse entries columns.
 */
export function useWarehouseEntriesColumns() {
  return React.useMemo(
    () => [
      {
        Header: 'Warehouse Name',
        accessor: 'warehouse_name',
        Cell: RadioTableCell,
        width: 120,
        disableSortBy: true,
        className: 'name',
      },
      {
        id: 'quantity',
        Header: 'Quantity on Hand',
        accessor: 'quantity',
        disableSortBy: true,
        align: 'right',
        width: 60,
      },
      {
        id: 'availiable_for_sale',
        Header: 'Availiable for Sale',
        accessor: 'availiable_for_sale',
        disableSortBy: true,
        align: 'right',
        width: 60,
        className: 'availiable_for_sale',
      },
    ],
    [],
  );
}

export function IntegrateWarehouseTable({ children }) {
  return (
    <>
      <GlobalPopoverStyled />
      <Popover2
        // minimal={true}
        content={<IntegrateWarehousesTable />}
        interactionKind={PopoverInteractionKind.CLICK}
        position={Position.BOTTOM_RIGHT}
        popoverClassName={Classes.WAREHOUSE_ITEM_ENTRY_POPOVER}
        autoFocus={false}
        enforceFocus={false}
        shouldReturnFocusOnClose={false}
      >
        {children}
      </Popover2>
    </>
  );
}

const PopoverLink = styled.button`
  border: 0;
  cursor: pointer;
  background: transparent;
  margin-top: 18px;
  padding-right: 0px;
  color: #0052cc;
  &:hover,
  &:active {
    text-decoration: underline;
  }
`;

export function IntegrateWarehousesTable({
  // #ownProps
  onUpdateData,
  entries,
  errors,
}) {
  // warehouses entries columns.
  const columns = useWarehouseEntriesColumns();

  // Handle update data.
  const handleUpdateData = React.useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  const data = React.useMemo(
    () => [
      {
        warehouse_name: true,
        quantity: '9,444',
        availiable_for_sale: 0,
      },
      {
        warehouse_name: false,
        quantity: '19,444',
        availiable_for_sale: 0,
      },
      {
        warehouse_name: false,
        quantity: '19,444',
        availiable_for_sale: 0,
      },

      {
        warehouse_name: false,
        quantity: '19,444',
        availiable_for_sale: 0,
      },
    ],
    [],
  );

  return (
    <WarehousesRoot>
      <PopoverHeader>Warehouses</PopoverHeader>

      <WarehouseDataTable
        columns={columns}
        data={data}
        styleName={TableStyle.Constrant}
        payload={{
          errors: errors || [],
          updateData: handleUpdateData,
        }}
      />

      <WarehousesDesc>
        <WarehousesDescItem>
          Stock on Hand : This is calculated based on Bills and Invoices.
        </WarehousesDescItem>
        <WarehousesDescItem>
          Available for Sale : Stock on Hand - Committed Stock
        </WarehousesDescItem>
      </WarehousesDesc>
    </WarehousesRoot>
  );
}

const WarehouseDataTable = styled(DataTable)`
  .table {
    font-size: 12px;
    border-bottom: 1px solid #888;

    .thead .tr:first-of-type .th,
    .thead .tr:first-of-type .th {
      border-top-color: #888;
    }
    .thead .tr .th {
      border-bottom-color: #888;
      font-size: 12px;
    }
    .tbody .tr .td {
      padding: 0.6rem 0.6rem;

      &:not(:first-of-type) {
        border-left: 1px solid #e6e6e6;
      }
    }

    .tbody {
      max-height: 145px;

      .bp3-form-group .bp3-control,
      .bp3-form-group {
        margin: 0;
      }

      .tr .td.availiable_for_sale {
        font-weight: 600;
      }
    }
  }
`;

const WarehousesRoot = styled.div`
  width: 500px;
`;

const WarehousesDescItem = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 6px;
  }
`;
const WarehousesDesc = styled.div`
  font-size: 10px;
  padding: 12px 15px;
`;

const PopoverHeader = styled.div`
  color: #222;
  line-height: 1;
  padding: 10px 15px;
  font-size: 12px;
  font-weight: 500;
`;

const GlobalPopoverStyled = createGlobalStyle`
  .${Classes.WAREHOUSE_ITEM_ENTRY_POPOVER}{
    &.bp3-popover2,
    .bp3-popover2-content{
      border-radius: 10px;
    }
  }
`;
