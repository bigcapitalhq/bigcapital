import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useEstimatesListContext } from './EstimatesListProvider';
import { useBulkDeleteEstimatesDialog } from './hooks/use-bulk-delete-estimates-dialog';
import { withEstimates } from './withEstimates';
import { withEstimatesActions } from './withEstimatesActions';
import type { WithEstimatesProps } from './withEstimates';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  FormattedMessage as T,
  AdvancedFilterPopover,
  Icon,
  Can,
  DashboardActionViewsList,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';
import { SaleEstimateAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useRefreshEstimates } from '@/hooks/query/estimates';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useSaveSettings } from '@/hooks/query';
import { compose } from '@/utils';

interface WithEstimatesActionsProps {
  setEstimatesTableState: (state: Record<string, any>) => void;
}

interface EstimateActionsBarProps
  extends Pick<WithEstimatesProps, 'estimatesSelectedRows'>,
    WithEstimatesActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {
  estimatesFilterRoles: any[];
}

function EstimateActionsBar({
  setEstimatesTableState,
  estimatesFilterRoles,
  estimatesSelectedRows = [],
  openDialog,
  openDrawer,
}: EstimateActionsBarProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();
  const { estimatesViews, fields, estimatesSettings } =
    useEstimatesListContext();
  const estimatesTableSize = estimatesSettings?.tableSize as string | undefined;
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  const onClickNewEstimate = () => {
    history.push('/estimates/new');
  };
  const { refresh } = useRefreshEstimates();

  const handleTabChange = (view: { slug?: string } | null) => {
    setEstimatesTableState({
      viewSlug: view ? view.slug : null,
    });
  };
  const handleRefreshBtnClick = () => {
    refresh();
  };
  const handleTableRowSizeChange = (size: any) => {
    saveSettings({
      options: [{ group: 'salesEstimates', key: 'tableSize', value: size }],
    });
  };
  const handleImportBtnClick = () => {
    history.push('/estimates/import');
  };
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'sale_estimate' });
  };
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'SaleEstimate' });
  };
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'SaleEstimate' });
  };

  const { openBulkDeleteDialog, isValidatingBulkDeleteEstimates } =
    useBulkDeleteEstimatesDialog();

  const handleBulkDelete = () => {
    openBulkDeleteDialog(estimatesSelectedRows as number[]);
  };

  if (!isEmpty(estimatesSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteEstimates}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'estimates'}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          views={estimatesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={SaleEstimateAction.Create} a={AbilitySubject.Estimate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_estimate'} />}
            onClick={onClickNewEstimate}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: estimatesFilterRoles,
            defaultFieldKey: 'estimate_number',
            fields: fields,
            onFilterChange: (filterConditions: any) => {
              setEstimatesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={estimatesFilterRoles.length}
          />
        </AdvancedFilterPopover>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={estimatesTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        <Popover
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_RIGHT}
          modifiers={{
            offset: { offset: '0, 4' },
          }}
          content={
            <Menu>
              <MenuItem
                onClick={handleCustomizeBtnClick}
                text={'Customize Templates'}
              />
            </Menu>
          }
        >
          <Button icon={<Icon icon="cog-16" iconSize={16} />} minimal={true} />
        </Popover>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const EstimatesActionsBar = compose(
  withEstimatesActions,
  withEstimates(({ estimatesTableState, estimatesSelectedRows }) => ({
    estimatesFilterRoles: estimatesTableState.filterRoles,
    estimatesSelectedRows: estimatesSelectedRows || [],
  })),
  withDialogActions,
  withDrawerActions,
)(EstimateActionsBar);
