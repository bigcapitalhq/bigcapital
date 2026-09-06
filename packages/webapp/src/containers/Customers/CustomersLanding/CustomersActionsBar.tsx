import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Intent,
  Switch,
  Alignment,
} from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useCustomersListContext } from './CustomersListProvider';
import { useBulkDeleteCustomersDialog } from './hooks/use-bulk-delete-customers-dialog';
import { withCustomers } from './withCustomers';
import { withCustomersActions } from './withCustomersActions';
import type { WithCustomersProps } from './withCustomers';
import type { WithCustomersActionsProps } from './withCustomersActions';
import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  Icon,
  Can,
  FormattedMessage as T,
  DashboardActionViewsList,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';
import { CustomerAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { useRefreshCustomers } from '@/hooks/query/customers';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { compose } from '@/utils';

interface CustomerActionsBarInnerProps
  extends Pick<WithCustomersProps, 'customersTableState'>,
    WithCustomersActionsProps,
    WithDialogActionsProps {
  customersSelectedRows: unknown[];
  customersFilterConditions: IFilterRole[];
  customersInactiveMode: boolean | undefined;
}

/**
 * Customers actions bar.
 */
function CustomerActionsBar({
  // #withCustomers
  customersSelectedRows = [],
  customersFilterConditions,

  // #withCustomersActions
  setCustomersTableState,
  customersInactiveMode,

  // #withDialogActions
  openDialog,
}: CustomerActionsBarInnerProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const bulkDelete = useBulkDeleteCustomersDialog();
  const { openBulkDeleteDialog } = bulkDelete;
  // `isValidatingBulkDeleteCustomers` is not on the hook's return type — preserved
  // latent bug (the value would be undefined at runtime anyway).
  const isValidatingBulkDeleteCustomers = (
    bulkDelete as { isValidatingBulkDeleteCustomers?: boolean }
  ).isValidatingBulkDeleteCustomers;

  // History context.
  const history = useHistory();

  // Customers list context.
  const { customersViews, fields, customersSettings } =
    useCustomersListContext();
  const customersTableSize = customersSettings?.tableSize as string | undefined;

  // Customers refresh action.
  const { refresh } = useRefreshCustomers();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  const onClickNewCustomer = () => {
    history.push('/customers/new');
  };

  // Handle Customers bulk delete button click.,
  const handleBulkDelete = () => {
    openBulkDeleteDialog(customersSelectedRows as number[]);
  };

  const handleTabChange = (view?: { slug?: string }) => {
    setCustomersTableState({
      viewSlug: view ? view.slug : null,
    });
  };
  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setCustomersTableState({ inactiveMode: checked });
  };

  // Handle click a refresh customers
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size: string) => {
    saveSettings({
      options: [{ group: 'customers', key: 'tableSize', value: size }],
    });
  };

  // Handle import button click.
  const handleImportBtnClick = () => {
    history.push('/customers/import');
  };

  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'customer' });
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'Customer' });
  };

  if (!isEmpty(customersSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteCustomers}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'customers'}
          views={customersViews}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={CustomerAction.Create} a={AbilitySubject.Customer}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_customer'} />}
            onClick={onClickNewCustomer}
          />
          <NavbarDivider />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: customersFilterConditions,
            defaultFieldKey: 'display_name',
            fields: fields,
            onFilterChange: (filterConditions: IFilterRole[]) => {
              setCustomersTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={customersFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          onClick={handleImportBtnClick}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={customersTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
        <Can I={CustomerAction.Edit} a={AbilitySubject.Customer}>
          <Switch
            labelElement={<T id={'inactive'} />}
            defaultChecked={customersInactiveMode}
            onChange={handleInactiveSwitchChange}
          />
        </Can>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const CustomersActionsBar = compose(
  withCustomersActions,
  withCustomers(({ customersSelectedRows, customersTableState }) => ({
    customersSelectedRows,
    customersInactiveMode: customersTableState.inactiveMode,
    customersFilterConditions: customersTableState.filterRoles,
  })),
  withDialogActions,
)(CustomerActionsBar);
