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
import { useBulkDeleteVendorsDialog } from './hooks/use-bulk-delete-vendors-dialog';
import { useVendorsListContext } from './VendorsListProvider';
import { withVendors } from './withVendors';
import { withVendorsActions } from './withVendorsActions';
import type { WithVendorsProps } from './withVendors';
import type { WithVendorsActionsProps } from './withVendorsActions';
import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  Can,
  Icon,
  FormattedMessage as T,
  DashboardActionViewsList,
  DashboardFilterButton,
  DashboardActionsBar,
  DashboardRowsHeightButton,
  AdvancedFilterPopover,
} from '@/components';
import { VendorAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useRefreshVendors } from '@/hooks/query/vendors';
import { compose } from '@/utils';

interface VendorActionsBarInnerProps
  extends Pick<WithVendorsProps, 'vendorsTableState'>,
    WithVendorsActionsProps,
    WithDialogActionsProps {
  vendorsSelectedRows: unknown[];
  vendorsFilterConditions: IFilterRole[];
  vendorsInactiveMode: boolean | undefined;
}

/**
 * Vendors actions bar.
 */
function VendorActionsBarInner({
  // #withVendors
  vendorsSelectedRows = [],
  vendorsFilterConditions,

  // #withVendorActions
  setVendorsTableState,
  vendorsInactiveMode,

  // #withDialogActions
  openDialog,
}: VendorActionsBarInnerProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();
  const bulkDelete = useBulkDeleteVendorsDialog();
  const { openBulkDeleteDialog } = bulkDelete;
  // `isValidatingBulkDeleteVendors` is not on the hook's return type — preserved
  // latent bug (the value would be undefined at runtime anyway).
  const isValidatingBulkDeleteVendors = (
    bulkDelete as { isValidatingBulkDeleteVendors?: boolean }
  ).isValidatingBulkDeleteVendors;

  // Vendors list context.
  const { vendorsViews, fields, vendorsSettings } = useVendorsListContext();
  const vendorsTableSize = vendorsSettings?.tableSize as string | undefined;

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Handles new vendor button click.
  const onClickNewVendor = () => {
    history.push('/vendors/new');
  };
  // Vendors refresh action.
  const { refresh } = useRefreshVendors();

  // Handle the active tab change.
  const handleTabChange = (viewSlug: string) => {
    setVendorsTableState({ viewSlug });
  };
  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setVendorsTableState({ inactiveMode: checked });
  };
  // Handle click a refresh sale estimates
  const handleRefreshBtnClick = () => {
    refresh();
  };
  const handleTableRowSizeChange = (size: string) => {
    saveSettings({
      options: [{ group: 'vendors', key: 'tableSize', value: size }],
    });
  };
  // Handle import button success.
  const handleImportBtnSuccess = () => {
    history.push('/vendors/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'vendor' });
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'Vendor' });
  };

  const handleBulkDelete = () => {
    openBulkDeleteDialog(vendorsSelectedRows as number[]);
  };

  if (!isEmpty(vendorsSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteVendors}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'vendors'}
          views={vendorsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={VendorAction.Create} a={AbilitySubject.Vendor}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_vendor'} />}
            onClick={onClickNewVendor}
          />
          <NavbarDivider />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: vendorsFilterConditions,
            defaultFieldKey: 'display_name',
            fields: fields,
            onFilterChange: (filterConditions: IFilterRole[]) => {
              setVendorsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={vendorsFilterConditions.length}
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
          text={<T id={'import'} />}
          onClick={handleImportBtnSuccess}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={vendorsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
        <Can I={VendorAction.Edit} a={AbilitySubject.Vendor}>
          <Switch
            labelElement={<T id={'inactive'} />}
            defaultChecked={vendorsInactiveMode}
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

export const VendorActionsBar = compose(
  withVendorsActions,
  withVendors(({ vendorsTableState, vendorsSelectedRows }) => ({
    vendorsSelectedRows,
    vendorsInactiveMode: vendorsTableState.inactiveMode,
    vendorsFilterConditions: vendorsTableState.filterRoles,
  })),
  withDialogActions,
)(VendorActionsBarInner);
