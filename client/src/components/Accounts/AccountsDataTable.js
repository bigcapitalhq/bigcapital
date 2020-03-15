import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Sort,
} from '@syncfusion/ej2-react-grids';
import React, {useEffect} from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Checkbox,
} from '@blueprintjs/core';
import {useParams} from 'react-router-dom';
import useAsync from 'hooks/async';
import Icon from 'components/Icon';
import { handleBooleanChange, compose } from 'utils';
import AccountsConnect from 'connectors/Accounts.connector';
import DialogConnect from 'connectors/Dialog.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import ViewConnect from 'connectors/View.connector';
import LoadingIndicator from 'components/LoadingIndicator';

function AccountsDataTable({
  accounts,
  onDeleteAccount,
  onInactiveAccount,
  openDialog,
  addBulkActionAccount,
  removeBulkActionAccount,
  fetchAccounts,
  changeCurrentView,
  changePageSubtitle,
  getViewItem,
  setTopbarEditView
}) {
  const { custom_view_id: customViewId } = useParams();

  // Fetch accounts list according to the given custom view id.
  const fetchHook = useAsync(async () => {
    await Promise.all([
      fetchAccounts({ custom_view_id: customViewId }),
    ]);
  });
  // Refetch accounts list after custom view id change.
  useEffect(() => {
    const viewMeta = getViewItem(customViewId);
    fetchHook.execute();

    if (customViewId) {
      changeCurrentView(customViewId);
      setTopbarEditView(customViewId);
    }
    if (customViewId && viewMeta) {
      changePageSubtitle(viewMeta.name);
    } else {
      changePageSubtitle('');
    }
  }, [customViewId]);

  useEffect(() => () => {
    // Clear page subtitle when unmount the page.
    changePageSubtitle('');
  }, []);

  const handleEditAccount = (account) => () => {
    openDialog('account-form', {action: 'edit', id: account.id});
  };
  const actionMenuList = (account) =>
    (<Menu>
      <MenuItem text="View Details" />
      <MenuDivider />
      <MenuItem text="Edit Account" onClick={handleEditAccount(account)} />
      <MenuItem text="New Account" />
      <MenuDivider />
      <MenuItem text="Inactivate Account" onClick={() => onInactiveAccount(account)} />
      <MenuItem text="Delete Account" onClick={() => onDeleteAccount(account)} />
    </Menu>);
  
  const handleClickCheckboxBulk = (account) => handleBooleanChange((value) => {
    if (value) {
      addBulkActionAccount(account.id);
    } else {
      removeBulkActionAccount(account.id);
    }
  });

  const columns = [
    {
      field: '',
      headerText: '',
      template: (account) => (<Checkbox onChange={handleClickCheckboxBulk(account)} />),
      customAttributes: {class: 'checkbox-row'}
    },
    {
      field: 'name',
      headerText: 'Account Name',
      customAttributes: {class: 'account-name'},
    },
    {
      field: 'code',
      headerText: 'Code',
    },
    {
      field: 'type.name',
      headerText: 'Type',
    },
    {
      headerText: 'Normal',
      template: (column) => {
        const type = column.type ? column.type.normal : '';
        return type === 'credit' ? (<Icon icon={'arrow-down'} />) : ((<Icon icon={'arrow-up'} />));
      },
      customAttributes: {class: 'account-normal'},
    },
    {
      field: 'balance',
      headerText: 'Balance',
      template: (column, data) => { return <span>$10,000</span>; },
    },
    {
      headerText: '',
      template: (account) => (
        <Popover content={actionMenuList(account)} position={Position.RIGHT_BOTTOM}>
          <Button icon={<Icon icon="ellipsis-h" />} />
        </Popover>
      ),
    }
  ];

  const dataStateChange = (state) => {
    
  }
  return (
    <LoadingIndicator loading={fetchHook.pending} spinnerSize={30}>
      <GridComponent
        allowSorting={true}
        allowGrouping={true}
        dataSource={{result: accounts, count: 12}}
        dataStateChange={dataStateChange}
        >
        <ColumnsDirective>
          {columns.map((column) => {
            return (<ColumnDirective
              field={column.field}
              headerText={column.headerText}
              template={column.template}
              allowSorting={true}
              customAttributes={column.customAttributes}
              />);
          })}
        </ColumnsDirective>
        <Inject services={[Sort]} />
      </GridComponent>
    </LoadingIndicator>
  );
}

export default compose(
  AccountsConnect,
  DialogConnect,
  DashboardConnect,
  ViewConnect,
)(AccountsDataTable);