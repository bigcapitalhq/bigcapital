import React, { useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Checkbox
} from '@blueprintjs/core';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Sort
} from '@syncfusion/ej2-react-grids';
import LoadingIndicator from 'components/LoadingIndicator';
import DashboardConnect from 'connectors/Dashboard.connector';
import ItemFormDialogConnect from 'connectors/ItemFormDialog.connect';
import Icon from 'components/Icon';
import { useParams } from 'react-router-dom';
import { handleBooleanChange, compose } from 'utils';
import DataTable from 'components/DataTable';
const categoryList = ({ categories }) => {
  const columns = [
    {
      field: 'name',
      headerText: 'Name'
    },
    {
      field: 'description',
      headerText: 'Description'
    }
  ];
  return (
    <LoadingIndicator>
      <GridComponent
        allowSorting={true}
        dataSource={columns}
        enableVirtualization={true}
      >
        <ColumnsDirective>
          <ColumnDirective type='checkbox'></ColumnDirective>
          {/* {columns.map(column => {
            return (
              <ColumnDirective
                field={column.field}
                headerText={column.headerText}
                allowSorting={true}
              />
            );
          })} */}
        </ColumnsDirective>
      </GridComponent>
    </LoadingIndicator>
  );
};

export default compose(DashboardConnect, ItemFormDialogConnect)(categoryList);
