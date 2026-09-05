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
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBulkDeleteItemsDialog } from './hooks/use-bulk-delete-items-dialog';
import { useItemsListContext } from './ItemsListProvider';
import { withItems } from './withItems';
import { withItemsActions } from './withItemsActions';
import type { WithItemsProps } from './withItems';
import type { WithItemsActionsProps } from './withItemsActions';
import type { IFilterRole } from '@/components/AdvancedFilter/interfaces';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  DashboardActionsBar,
  DashboardRowsHeightButton,
  FormattedMessage as T,
} from '@/components';
import {
  If,
  Can,
  Icon,
  DashboardActionViewsList,
  AdvancedFilterPopover,
  DashboardFilterButton,
} from '@/components';
import { ItemAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useSaveSettings } from '@/hooks/query';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useRefreshItems } from '@/hooks/query/items';
import { compose } from '@/utils';

interface ItemsActionsBarInnerProps
  extends Pick<WithItemsProps, 'itemsSelectedRows' | 'itemsTableState'>,
    WithItemsActionsProps,
    WithDialogActionsProps {
  itemsFilterRoles: IFilterRole[];
  itemsInactiveMode: boolean | undefined;
}

/**
 * Items actions bar.
 */
function ItemsActionsBarInner({
  // #withItems
  itemsSelectedRows,
  itemsFilterRoles,

  // #withItemActions
  setItemsTableState,
  itemsInactiveMode,

  // #withDialogActions
  openDialog,
}: ItemsActionsBarInnerProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const bulkDelete = useBulkDeleteItemsDialog();
  const { openBulkDeleteDialog } = bulkDelete;
  // `isValidatingBulkDeleteItems` is not on the return type (the hook returns
  // `isValidatingBulkDelete`); preserved latent bug — the value is `undefined`
  // at runtime, so the disable-while-validating never triggers.
  const isValidatingBulkDeleteItems = (
    bulkDelete as { isValidatingBulkDeleteItems?: boolean }
  ).isValidatingBulkDeleteItems;

  // Items list context.
  const { itemsSettings, itemsViews, fields } = useItemsListContext();
  const itemsTableSize = itemsSettings?.tableSize as string | undefined;

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Items refresh action.
  const { refresh } = useRefreshItems();

  // History context.
  const history = useHistory();

  // Handle `new item` button click.
  const onClickNewItem = () => {
    history.push('/items/new');
  };

  // Handle tab changing.
  const handleTabChange = (view?: { slug?: string }) => {
    setItemsTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle cancel/confirm items bulk.
  const handleBulkDelete = () => {
    openBulkDeleteDialog(itemsSelectedRows as number[]);
  };

  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setItemsTableState({ inactiveMode: checked });
  };
  // Handle refresh button click.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size: string) => {
    saveSettings({
      options: [{ group: 'items', key: 'tableSize', value: size }],
    });
  };
  // Handles the import button click.
  const handleImportBtnClick = () => {
    history.push('/items/import');
  };

  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'item' });
  };

  // Handle the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'Item' });
  };

  if (!isEmpty(itemsSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteItems}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'items'}
          allMenuItem={true}
          allMenuItemText={<T id={'all_items'} />}
          views={itemsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />

        <Can I={ItemAction.Create} a={AbilitySubject.Item}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'new_item'} />}
            onClick={onClickNewItem}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: itemsFilterRoles,
            defaultFieldKey: 'name',
            fields: fields,
            onFilterChange: (filterConditions: IFilterRole[]) => {
              setItemsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton conditionsCount={itemsFilterRoles.length} />
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
          initialValue={itemsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
        <Can I={ItemAction.Edit} a={AbilitySubject.Item}>
          <Switch
            labelElement={<T id={'inactive'} />}
            defaultChecked={itemsInactiveMode}
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

export const ItemsActionsBar = compose(
  withItems(({ itemsSelectedRows, itemsTableState }) => ({
    itemsSelectedRows,
    itemsInactiveMode: itemsTableState.inactiveMode,
    itemsFilterRoles: itemsTableState.filterRoles,
  })),
  withItemsActions,
  withDialogActions,
)(ItemsActionsBarInner);
